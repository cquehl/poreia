import Phaser from 'phaser';
import { Colors } from '../main'; // Import colors

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Load any specific menu assets here if needed
        // For now, we'll just use Phaser's built-in text rendering
    }

    create() {
        const screenWidth = this.sys.game.config.width as number;
        const screenHeight = this.sys.game.config.height as number;

        // Title Text
        this.add.text(screenWidth / 2, screenHeight / 4, "Wilderness Survival", {
            fontFamily: 'Arial',
            fontSize: '72px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        // Start Game Button
        const startButtonText = this.add.text(0, 0, "Start Game", {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#FFFFFF'
        }).setOrigin(0.5);


        const startButtonWidth = startButtonText.width + 40;
        const startButtonHeight = 70;
        const startButtonRect = this.add.rectangle(0, 0, startButtonWidth, startButtonHeight, Colors.GREEN);

        this.add.container(screenWidth / 2, screenHeight / 2, [startButtonRect, startButtonText])
            .setSize(startButtonWidth, startButtonHeight)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => startButtonRect.fillColor = Colors.DARK_GREEN)
            .on('pointerout', () => startButtonRect.fillColor = Colors.GREEN)
            .on('pointerdown', () => this.scene.start('GameScene'));


        // Quit Button (will just log for web, as quitting browser is not standard)
        const quitButtonText = this.add.text(0, 0, "Quit", {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        const quitButtonWidth = quitButtonText.width + 40;
        const quitButtonHeight = 70;

        const quitButtonRect = this.add.rectangle(0, 0, quitButtonWidth, quitButtonHeight, Colors.RED);
        
        this.add.container(screenWidth / 2, screenHeight / 2 + 100, [quitButtonRect, quitButtonText])
            .setSize(quitButtonWidth, quitButtonHeight)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => quitButtonRect.fillColor = 0x960000) // Darker Red
            .on('pointerout', () => quitButtonRect.fillColor = Colors.RED)
            .on('pointerdown', () => {
                console.log("Quitting Game (in web, this typically closes the tab or does nothing)");
            });
    }
}