import Phaser from 'phaser';
import { Player } from '../game/Player';
import { ActionProps, ENVIRONMENTS, getRandomActionQuantity } from '../game/Environment';
import { Colors } from '../main';

export class GameScene extends Phaser.Scene {
    player!: Player;
    currentMessage: string = "";

    // UI Elements
    healthText!: Phaser.GameObjects.Text;
    hungerText!: Phaser.GameObjects.Text;
    energyText!: Phaser.GameObjects.Text;
    moraleText!: Phaser.GameObjects.Text;
    inventoryText!: Phaser.GameObjects.Text;
    environmentText!: Phaser.GameObjects.Text;
    messageBoxGraphics!: Phaser.GameObjects.Graphics;
    messageBoxText!: Phaser.GameObjects.Text;

    // Use a group for action buttons for easier management
    actionButtonContainer!: Phaser.GameObjects.Container;
    endDayButtonContainer!: Phaser.GameObjects.Container;
    sys: any;
    add: any;
    input: any;
    scene: any;

    constructor() {
        super('GameScene');
    }

    preload() {
        // Load assets here if you have images for background/buttons
        // this.load.image('forest_bg', 'assets/images/forest_bg.png');
    }

    create() {
        const screenWidth = this.sys.game.config.width as number;
        const screenHeight = this.sys.game.config.height as number;

        this.player = new Player();
        this.currentMessage = `Welcome to the ${this.player.currentEnvironment}!`;

        // --- Background Placeholder ---
        this.add.graphics()
            .fillStyle(0x1E501E, 1) // Dark Green
            .fillRect(0, 0, screenWidth, screenHeight - 250);

        // --- UI Elements ---
        // Player Stats Box
        const statsBoxX = 20;
        const statsBoxY = 20;
        const statsBoxWidth = 250;
        const statsBoxHeight = 150;

        this.add.graphics()
            .fillStyle(Colors.GRAY, 1)
            .fillRoundedRect(statsBoxX, statsBoxY, statsBoxWidth, statsBoxHeight, 5);

        this.healthText = this.add.text(statsBoxX + 10, statsBoxY + 10, '', { fontSize: '24px', color: '#FFFFFF' });
        this.hungerText = this.add.text(statsBoxX + 10, statsBoxY + 40, '', { fontSize: '24px', color: '#FFFFFF' });
        this.energyText = this.add.text(statsBoxX + 10, statsBoxY + 70, '', { fontSize: '24px', color: '#FFFFFF' });
        this.moraleText = this.add.text(statsBoxX + 10, statsBoxY + 100, '', { fontSize: '24px', color: '#FFFFFF' });

        // Inventory Box
        const inventoryBoxX = 20;
        const inventoryBoxY = statsBoxY + statsBoxHeight + 10;
        const inventoryBoxWidth = 250;
        const inventoryBoxHeight = 200;

        this.add.graphics()
            .fillStyle(Colors.GRAY, 1)
            .fillRoundedRect(inventoryBoxX, inventoryBoxY, inventoryBoxWidth, inventoryBoxHeight, 5);
        
        this.add.text(inventoryBoxX + 10, inventoryBoxY + 10, 'Inventory:', { fontSize: '24px', color: '#FFFFFF' });
        this.inventoryText = this.add.text(inventoryBoxX + 10, inventoryBoxY + 40, '', { fontSize: '20px', color: '#FFFFFF' });

        // Environment Text
        this.environmentText = this.add.text(screenWidth - 20, 20, '', { fontSize: '24px', color: '#FFFF00' })
            .setOrigin(1, 0);

        // Message Box
        const messageBoxX = 320;
        const messageBoxY = screenHeight - 200;
        const messageBoxWidth = screenWidth - 350;
        const messageBoxHeight = 150;

        this.messageBoxGraphics = this.add.graphics()
            .fillStyle(Colors.LIGHT_GRAY, 1)
            .fillRoundedRect(messageBoxX, messageBoxY, messageBoxWidth, messageBoxHeight, 5);
        
        this.messageBoxText = this.add.text(messageBoxX + 10, messageBoxY + 10, '', {
            fontSize: '24px',
            color: '#FFFFFF',
            wordWrap: { width: messageBoxWidth - 20 }
        });

        this.updateUI(); // Initial UI update

        // Initialize action button container BEFORE setting up buttons
        this.actionButtonContainer = this.add.container(0, 0); 

        // Set up dynamic action buttons
        this.setupGameButtons();

        // End Day button
        const endDayRect = this.add.rectangle(0, 0, 150, 70, Colors.GRAY);
        const endDayText = this.add.text(0, 0, "End Day", {
            fontFamily: 'Arial', fontSize: '24px', color: '#FFFFFF'
        }).setOrigin(0.5);

        this.endDayButtonContainer = this.add.container(screenWidth - 200, screenHeight - 100, [endDayRect, endDayText])
            .setInteractive(new Phaser.Geom.Rectangle(0, 0, 150, 70), Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => endDayRect.fillColor = Colors.LIGHT_GRAY)
            .on('pointerout', () => endDayRect.fillColor = Colors.GRAY)
            .on('pointerdown', () => this.endDay());

        // Hotkey listeners
        this.input.keyboard!.on('keydown-E', () => this.endDay());
        // Add more hotkeys here, e.g., for specific actions needed a !
        // this.input.keyboard.on!('keydown-F', () => this.performAction(...));
    }

    updateUI(): void {
        this.healthText.setText(`Health: ${this.player.health}%`);
        this.hungerText.setText(`Hunger: ${this.player.hunger}%`);
        this.energyText.setText(`Energy: ${this.player.energy}%`);
        this.moraleText.setText(`Morale: ${this.player.morale}%`);

        let inventoryString = 'Inventory:\n';
        for (const item in this.player.inventory) {
            inventoryString += `  ${item}: ${this.player.inventory[item]}\n`;
        }
        this.inventoryText.setText(inventoryString);

        this.environmentText.setText(`Location: ${this.player.currentEnvironment} (Day: ${this.player.day})`);
        this.messageBoxText.setText(this.currentMessage);
    }

    setupGameButtons(): void {
        // Clear existing buttons from the container
        this.actionButtonContainer.removeAll(true); // true to destroy children

        const screenHeight = this.sys.game.config.height as number;
        const currentEnv = ENVIRONMENTS[this.player.currentEnvironment];

        let yOffset = screenHeight - 200; // Starting Y position for buttons

        for (const actionName in currentEnv.availableActions) {
            const actionProps = currentEnv.availableActions[actionName];
            
            const buttonWidth = 250;
            const buttonHeight = 60;
            const buttonX = 50 + buttonWidth / 2; // Center X for the container
            const buttonY = yOffset + buttonHeight / 2; // Center Y for the container

            // Create a graphical rectangle for the button background
            const buttonRect = this.add.rectangle(0, 0, buttonWidth, buttonHeight, Colors.BLUE);

            // Create the text for the button
            const buttonText = this.add.text(0, 0, actionName, {
                fontFamily: 'Arial', fontSize: '24px', color: '#FFFFFF'
            }).setOrigin(0.5);

            // Create a container to group the rectangle and text
            const buttonContainer = this.add.container(buttonX, buttonY, [buttonRect, buttonText]);
            
            // Make the container interactive. The hit area is the rectangle.
            buttonContainer.setSize(buttonWidth, buttonHeight)
                .setInteractive()
                .on('pointerover', () => buttonRect.fillColor = 0x000096)
                .on('pointerout', () => buttonRect.fillColor = Colors.BLUE)
                .on('pointerdown', () => this.performAction(actionName, actionProps));

            this.actionButtonContainer.add(buttonContainer); // Add the container to our main action button container
            yOffset += 80; // Spacing for the next button
        }
    }

    endDay(): void {
        if (!this.player.updateDailyMetrics()) {
            this.currentMessage = "You succumbed to the wilderness... Game Over!";
            this.scene.start('GameOverScene', { message: this.currentMessage });
        } else {
            this.currentMessage = `Day ${this.player.day} begins in the ${this.player.currentEnvironment}.`;
            this.updateUI();
        }
    }

        performAction(actionName: string, actionProps: ActionProps): void {
        if (this.player.energy < actionProps.energy_cost) {
            this.currentMessage = "Not enough energy to perform this action!";
            this.updateUI();
            return;
        }

        this.player.useEnergy(actionProps.energy_cost);

        const isSuccess = Phaser.Math.Between(1, 100) <= actionProps.success_rate;

        if (isSuccess) {
            this.handleActionSuccess(actionName, actionProps);
        } else {
            this.currentMessage = `Action '${actionName}' failed.`;
        }
        
        this.updateUI();
    }

    /**
     * Handles the logic for a successful action.
     */
    private handleActionSuccess(actionName: string, actionProps: ActionProps): void {
        if (actionProps.result_item) {
            this.handleItemResult(actionName, actionProps);
        } else if (actionProps.result_event) {
            this.handleEventResult(actionProps);
        } else {
            this.currentMessage = `Action '${actionName}' successful!`;
        }
    }

    /**
     * Handles the result of an action that yields an item.
     */
    private handleItemResult(actionName: string, actionProps: ActionProps): void {
        const item = actionProps.result_item!;
        const quantity = getRandomActionQuantity(actionName);
        this.player.addItem(item, quantity);
        this.currentMessage = `Success! You found ${quantity} ${item}(s).`;

        if (actionName === 'Forage for Food') {
            this.player.updateMorale(10);
        }
    }

    /**
     * Handles the result of an action that triggers an event.
     */
    private handleEventResult(actionProps: ActionProps): void {
        const event = actionProps.result_event!;
        
        if (event === 'Discover New Area') {
            const availableEnvs = Object.keys(ENVIRONMENTS).filter(e => e !== this.player.currentEnvironment);
            if (availableEnvs.length > 0) {
                const newEnv = Phaser.Math.RND.pick(availableEnvs);
                this.player.currentEnvironment = newEnv;
                this.setupGameButtons();
                this.currentMessage = `You discovered a new area: the ${newEnv}!`;
            } else {
                this.currentMessage = "You found nowhere new to go.";
            }
        } else {
            this.currentMessage = `Success! Event triggered: ${event} (Not fully implemented yet).`;
        }
    }
}
