import Phaser from 'phaser';
import { eventBus } from '../ui/EventBus';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    private readonly handleStartGame = () => {
        this.scene.start('GameScene');
    }

    create() {
        eventBus.emit('viewChanged', 'menu');

        eventBus.on('startGame', this.handleStartGame);

        this.events.on('shutdown', () => {
            eventBus.off('startGame', this.handleStartGame);
        });
    }
}