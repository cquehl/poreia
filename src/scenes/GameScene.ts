import Phaser from 'phaser';
import { Player } from '../game/Player';
import { ENVIRONMENTS, getRandomActionQuantity, ActionProps } from '../game/Environment';
import { Logger } from '../game/Logger';
import { EventManager } from '../game/EventManager';
import { eventBus } from '../ui/EventBus';

export class GameScene extends Phaser.Scene {
    player!: Player;

    constructor() {
        super('GameScene');
    }

    create() {
        Logger.info('GameScene creating...');
        const screenWidth = this.sys.game.config.width as number;
        const screenHeight = this.sys.game.config.height as number;

        // --- Game World Setup ---
        this.add.graphics().fillStyle(0x1E501E, 1).fillRect(0, 0, screenWidth, screenHeight);

        // --- Game State Setup ---
        this.player = new Player();
        this.player.initialize(); // Emit initial state to the UI
        eventBus.emit('messageChanged', `Welcome to the ${this.player.currentEnvironment}!`);

        // --- Listen for UI events ---
        this.registerUIListeners();

        // --- Keyboard Input ---
        this.input.keyboard!.on('keydown-E', () => this.endDay());
    }
    
    registerUIListeners() {
        eventBus.on('performAction', ({ actionName, actionProps }) => {
            this.performAction(actionName, actionProps);
        });
        eventBus.on('useItem', (itemName) => this.onUseItem(itemName));
        eventBus.on('endDay', () => this.endDay());
    }

    onUseItem(itemName: string) {
        if (this.player.useItem(itemName)) {
            eventBus.emit('messageChanged', `You used 1 ${itemName}.`);
            Logger.info(`Player used item: ${itemName}`);
        } else {
            Logger.warn(`Player failed to use item: ${itemName}`);
        }
    }

    endDay() {
        Logger.info(`Ending Day ${this.player.day}`);
        if (!this.player.updateDailyMetrics()) {
            const message = "You succumbed to the wilderness...";
            Logger.error('Player died. Game Over.');
            this.cleanup();
            this.scene.start('GameOverScene', { message });
        } else {
            const dailyEventMessage = EventManager.checkForDailyEvent(this.player.day, this.player);
            let newDayMessage = `Day ${this.player.day} begins in the ${this.player.currentEnvironment}.`;
            if (dailyEventMessage) {
                newDayMessage += `\n${dailyEventMessage}`;
            }
            eventBus.emit('messageChanged', newDayMessage);
        }
    }

    performAction(actionName: string, actionProps: ActionProps) {
        Logger.info(`Player attempts to perform action: ${actionName}`);
        if (this.player.energy < actionProps.energy_cost) {
            eventBus.emit('messageChanged', "Not enough energy to perform this action!");
            Logger.warn('Action failed: Not enough energy.');
            return;
        }

        this.player.useEnergy(actionProps.energy_cost);

        if (Phaser.Math.Between(1, 100) <= actionProps.success_rate) {
            this.handleActionSuccess(actionName, actionProps);
        } else {
            eventBus.emit('messageChanged', `Action '${actionName}' failed.`);
            Logger.warn(`Action '${actionName}' failed.`);
        }
    }

    private handleActionSuccess(actionName: string, actionProps: ActionProps) {
        if (actionProps.result_item) {
            const item = actionProps.result_item;
            const quantity = getRandomActionQuantity(actionName);
            this.player.addItem(item, quantity);
            eventBus.emit('messageChanged', `Success! You found ${quantity} ${item}(s).`);
            if (actionName === 'Forage for Food') this.player.updateMorale(10);
        } else if (actionProps.result_event) {
            this.handleEventResult(actionProps);
        } else {
            eventBus.emit('messageChanged', `Action '${actionName}' successful!`);
        }
    }

    private handleEventResult(actionProps: ActionProps) {
        const event = actionProps.result_event!;
        if (event === 'Discover New Area') {
            const availableEnvs = Object.keys(ENVIRONMENTS).filter(e => e !== this.player.currentEnvironment);
            if (availableEnvs.length > 0) {
                const newEnv = Phaser.Math.RND.pick(availableEnvs);
                this.player.changeEnvironment(newEnv);
                eventBus.emit('messageChanged', `You discovered a new area: the ${newEnv}!`);
            } else {
                eventBus.emit('messageChanged', "You found nowhere new to go.");
            }
        } else {
            eventBus.emit('messageChanged', `Success! Event triggered: ${event}.`);
        }
    }

    private cleanup() {
        // Remove all listeners from the event bus to prevent memory leaks
        eventBus.all.clear();
    }
}