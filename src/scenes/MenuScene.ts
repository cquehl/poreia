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
        const startButton = this.add.rectangle(screenWidth / 2, screenHeight / 2, 200, 70, Colors.GREEN)
            .setInteractive()
            .on('pointerover', () => startButton.fillColor = Colors.DARK_GREEN)
            .on('pointerout', () => startButton.fillColor = Colors.GREEN)
            .on('pointerdown', () => this.scene.start('GameScene')); // Transition to GameScene

        this.add.text(startButton.x, startButton.y, "Start Game", {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        // Quit Button (will just log for web, as quitting browser is not standard)
        const quitButton = this.add.rectangle(screenWidth / 2, screenHeight / 2 + 100, 200, 70, Colors.RED)
            .setInteractive()
            .on('pointerover', () => quitButton.fillColor = 0x960000) // Darker Red
            .on('pointerout', () => quitButton.fillColor = Colors.RED)
            .on('pointerdown', () => {
                console.log("Quitting Game (in web, this typically closes the tab or does nothing)");
                // You could add a "Thanks for playing" message or return to a landing page
            });

        this.add.text(quitButton.x, quitButton.y, "Quit", {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
    }
}