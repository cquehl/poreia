import Phaser from 'phaser';
import { Player } from '../game/Player';
import { ENVIRONMENTS, getRandomActionQuantity, ActionProps } from '../game/Environment';
import { Colors } from '../main';
import { Logger } from '../game/Logger';

export class GameScene extends Phaser.Scene {
    player!: Player;
    currentMessage: string = "";

    healthText!: Phaser.GameObjects.Text;
    hungerText!: Phaser.GameObjects.Text;
    thirstText!: Phaser.GameObjects.Text;
    energyText!: Phaser.GameObjects.Text;
    moraleText!: Phaser.GameObjects.Text;
    environmentText!: Phaser.GameObjects.Text;
    messageBoxText!: Phaser.GameObjects.Text;

    actionButtonContainer!: Phaser.GameObjects.Container;
    inventoryContainer!: Phaser.GameObjects.Container;

    constructor() {
        super('GameScene');
    }

    create() {
        Logger.info('GameScene creating...');
        const screenWidth = this.sys.game.config.width as number;
        const screenHeight = this.sys.game.config.height as number;

        this.player = new Player();
        this.currentMessage = `Welcome to the ${this.player.currentEnvironment}!`;

        this.add.graphics().fillStyle(0x1E501E, 1).fillRect(0, 0, screenWidth, screenHeight - 250);

        this.createStatsBox(20, 20);
        this.createInventoryBox(20, 180);
        this.createMessageBox(320, screenHeight - 200, screenWidth - 350, 150);
        this.createEndDayButton(screenWidth - 100, screenHeight - 60);

        this.environmentText = this.add.text(screenWidth - 20, 20, '', { fontSize: '24px', color: '#FFFF00' }).setOrigin(1, 0);
        
        this.actionButtonContainer = this.add.container(0, 0);
        this.setupActionButtons();

        this.input.keyboard!.on('keydown-E', () => this.endDay());
        this.updateUI();
    }

    createStatsBox(x: number, y: number) {
        this.add.graphics().fillStyle(Colors.GRAY, 1).fillRoundedRect(x, y, 250, 150, 5);
        this.healthText = this.add.text(x + 10, y + 10, '', { fontSize: '20px' });
        this.hungerText = this.add.text(x + 10, y + 35, '', { fontSize: '20px' });
        this.thirstText = this.add.text(x + 10, y + 60, '', { fontSize: '20px' });
        this.energyText = this.add.text(x + 10, y + 85, '', { fontSize: '20px' });
        this.moraleText = this.add.text(x + 10, y + 110, '', { fontSize: '20px' });
    }

    createInventoryBox(x: number, y: number) {
        this.add.graphics().fillStyle(Colors.GRAY, 1).fillRoundedRect(x, y, 250, 300, 5);
        this.add.text(x + 10, y + 10, 'Inventory:', { fontSize: '24px' });
        this.inventoryContainer = this.add.container(x + 10, y + 40);
    }

    createMessageBox(x: number, y: number, width: number, height: number) {
        this.add.graphics().fillStyle(Colors.LIGHT_GRAY, 1).fillRoundedRect(x, y, width, height, 5);
        this.messageBoxText = this.add.text(x + 10, y + 10, '', { fontSize: '24px', wordWrap: { width: width - 20 } });
    }

    createEndDayButton(x: number, y: number) {
        const endDayRect = this.add.rectangle(0, 0, 150, 70, Colors.GRAY);
        const endDayText = this.add.text(0, 0, "End Day", { fontSize: '24px' }).setOrigin(0.5);
        this.add.container(x, y, [endDayRect, endDayText])
            .setSize(150, 70).setInteractive({ useHandCursor: true })
            .on('pointerover', () => endDayRect.fillColor = Colors.LIGHT_GRAY)
            .on('pointerout', () => endDayRect.fillColor = Colors.GRAY)
            .on('pointerdown', () => this.endDay());
    }

    updateUI() {
        this.healthText.setText(`Health: ${this.player.health}%`);
        this.hungerText.setText(`Hunger: ${this.player.hunger}%`);
        this.thirstText.setText(`Thirst: ${this.player.thirst}%`);
        this.energyText.setText(`Energy: ${this.player.energy}%`);
        this.moraleText.setText(`Morale: ${this.player.morale}%`);
        this.environmentText.setText(`Location: ${this.player.currentEnvironment} (Day: ${this.player.day})`);
        this.messageBoxText.setText(this.currentMessage);
        this.updateInventoryUI();
        Logger.debug('UI Updated');
    }

    updateInventoryUI() {
        this.inventoryContainer.removeAll(true);
        let yOffset = 0;
        for (const itemName in this.player.inventory) {
            const quantity = this.player.inventory[itemName];
            if (quantity <= 0) continue;

            const itemText = this.add.text(0, yOffset, `${itemName}: ${quantity}`, { fontSize: '20px' });
            const useButton = this.add.text(150, yOffset, '[Use]', { fontSize: '20px', color: '#00FF00' })
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.onUseItem(itemName));
            
            this.inventoryContainer.add([itemText, useButton]);
            yOffset += 25;
        }
    }

    onUseItem(itemName: string) {
        if (this.player.useItem(itemName)) {
            this.currentMessage = `You used 1 ${itemName}.`;
            Logger.info(`Player used item: ${itemName}`);
            this.updateUI();
        } else {
            Logger.warn(`Player failed to use item: ${itemName}`);
        }
    }

    setupActionButtons() {
        this.actionButtonContainer.removeAll(true);
        const screenHeight = this.sys.game.config.height as number;
        const currentEnv = ENVIRONMENTS[this.player.currentEnvironment];
        let yOffset = 50;

        for (const actionName in currentEnv.availableActions) {
            const actionProps = currentEnv.availableActions[actionName];
            const buttonRect = this.add.rectangle(0, 0, 250, 60, Colors.BLUE);
            const buttonText = this.add.text(0, 0, actionName, { fontSize: '24px' }).setOrigin(0.5);
            const buttonContainer = this.add.container(450, yOffset, [buttonRect, buttonText]);
            
            buttonContainer.setSize(250, 60)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => buttonRect.fillColor = 0x000096)
                .on('pointerout', () => buttonRect.fillColor = Colors.BLUE)
                .on('pointerdown', () => this.performAction(actionName, actionProps));
            
            this.actionButtonContainer.add(buttonContainer);
            yOffset += 70;
        }
        Logger.info(`Action buttons set up for ${this.player.currentEnvironment}`);
    }

    endDay() {
        Logger.info(`Ending Day ${this.player.day}`);
        if (!this.player.updateDailyMetrics()) {
            this.currentMessage = "You succumbed to the wilderness...";
            Logger.error('Player died. Game Over.');
            this.scene.start('GameOverScene', { message: this.currentMessage });
        } else {
            this.currentMessage = `Day ${this.player.day} begins in the ${this.player.currentEnvironment}.`;
            this.updateUI();
        }
    }

    performAction(actionName: string, actionProps: ActionProps) {
        Logger.info(`Player attempts to perform action: ${actionName}`);
        if (this.player.energy < actionProps.energy_cost) {
            this.currentMessage = "Not enough energy to perform this action!";
            Logger.warn('Action failed: Not enough energy.');
            this.updateUI();
            return;
        }

        this.player.useEnergy(actionProps.energy_cost);

        if (Phaser.Math.Between(1, 100) <= actionProps.success_rate) {
            this.handleActionSuccess(actionName, actionProps);
        } else {
            this.currentMessage = `Action '${actionName}' failed.`;
            Logger.warn(`Action '${actionName}' failed.`);
        }
        this.updateUI();
    }

    private handleActionSuccess(actionName: string, actionProps: ActionProps) {
        if (actionProps.result_item) {
            const item = actionProps.result_item;
            const quantity = getRandomActionQuantity(actionName);
            this.player.addItem(item, quantity);
            this.currentMessage = `Success! You found ${quantity} ${item}(s).`;
            if (actionName === 'Forage for Food') this.player.updateMorale(10);
        } else if (actionProps.result_event) {
            this.handleEventResult(actionProps);
        } else {
            this.currentMessage = `Action '${actionName}' successful!`;
        }
    }

    private handleEventResult(actionProps: ActionProps) {
        const event = actionProps.result_event!;
        if (event === 'Discover New Area') {
            const availableEnvs = Object.keys(ENVIRONMENTS).filter(e => e !== this.player.currentEnvironment);
            if (availableEnvs.length > 0) {
                const newEnv = Phaser.Math.RND.pick(availableEnvs);
                this.player.currentEnvironment = newEnv;
                this.setupActionButtons();
                this.currentMessage = `You discovered a new area: the ${newEnv}!`;
            } else {
                this.currentMessage = "You found nowhere new to go.";
            }
        } else {
            this.currentMessage = `Success! Event triggered: ${event}.`;
        }
    }
}
