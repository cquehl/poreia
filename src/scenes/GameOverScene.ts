import Phaser from 'phaser';
import { eventBus } from '../ui/EventBus';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    private readonly handleRestartGame = () => {
        this.scene.start('MenuScene');
    }

    create(data: { message: string }) {
        eventBus.emit('viewChanged', 'gameover');
        eventBus.emit('gameOver', { message: data.message || "Game Over!" });

        // Correct 2-argument call
        eventBus.on('restartGame', this.handleRestartGame);
        
        this.events.on('shutdown', () => {
            // Correct 2-argument call
            eventBus.off('restartGame', this.handleRestartGame);
        });
    }
}