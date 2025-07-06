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
        eventBus.emit('viewChanged', 'hud');

        this.add.graphics().fillStyle(0x1E501E, 1).fillRect(0, 0, this.scale.width, this.scale.height);

        this.player = new Player();
        this.player.initialize();
        eventBus.emit('messageChanged', `Welcome to the ${this.player.currentEnvironment}!`);

        this.registerUIListeners();
        this.events.on('shutdown', this.shutdown, this);
    }
    
    shutdown() {
        Logger.info('GameScene shutting down...');
        this.events.off('shutdown', this.shutdown, this);
        this.unregisterUIListeners();
    }

    registerUIListeners() {
        // Use the arrow function handlers defined below
        eventBus.on('performAction', this.performAction);
        eventBus.on('useItem', this.onUseItem);
        eventBus.on('endDay', this.endDay);
        this.input.keyboard!.on('keydown-E', this.endDay);
    }

    unregisterUIListeners() {
        // Use the same handler references to unregister
        eventBus.off('performAction', this.performAction);
        eventBus.off('useItem', this.onUseItem);
        eventBus.off('endDay', this.endDay);
        this.input.keyboard!.off('keydown-E', this.endDay);
    }

    private readonly onUseItem = (itemName: string) => {
        if (this.player.useItem(itemName)) {
            eventBus.emit('messageChanged', `You used 1 ${itemName}.`);
        }
    }

    private readonly endDay = () => {
        if (!this.player.updateDailyMetrics()) {
            const message = "You succumbed to the wilderness...";
            Logger.error('Player died. Game Over.');
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

    private readonly performAction = (data: { actionName: string, actionProps: ActionProps }) => {
        const { actionName, actionProps } = data;
        if (this.player.energy < actionProps.energy_cost) {
            eventBus.emit('messageChanged', "Not enough energy to perform this action!");
            return;
        }

        this.player.useEnergy(actionProps.energy_cost);

        if (Phaser.Math.Between(1, 100) <= actionProps.success_rate) {
            this.handleActionSuccess(actionName, actionProps);
        } else {
            eventBus.emit('messageChanged', `Action '${actionName}' failed.`);
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
}