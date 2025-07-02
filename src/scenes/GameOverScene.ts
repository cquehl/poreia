import Phaser from 'phaser';
import { Colors } from '../main'; // Keep Colors import for rectangle fill

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data: { message: string }) {
        this.data.set('message', data.message);
    }

    create() {
        const screenWidth = this.sys.game.config.width as number;
        const screenHeight = this.sys.game.config.height as number;
        const message = this.data.get('message') ?? "Game Over!";

        this.add.text(screenWidth / 2, screenHeight / 2 - 50, "GAME OVER", {
            fontFamily: 'Arial',
            fontSize: '72px',
            color: '#FF0000'
        }).setOrigin(0.5);

        this.add.text(screenWidth / 2, screenHeight / 2 + 50, message, {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        // Restart Button
        const restartButtonRect = this.add.rectangle(0, 0, 200, 70, Colors.GREEN);
        const restartButtonText = this.add.text(0, 0, "Restart", {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        const restartButtonContainer = this.add.container(screenWidth / 2, screenHeight / 2 + 150, [restartButtonRect, restartButtonText])
            .setInteractive(new Phaser.Geom.Rectangle(0, 0, 200, 70), Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => restartButtonRect.fillColor = Colors.DARK_GREEN)
            .on('pointerout', () => restartButtonRect.fillColor = Colors.GREEN)
            .on('pointerdown', () => this.scene.start('GameScene'));
    }
}