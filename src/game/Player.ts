import Phaser from 'phaser';
import { Logger } from './Logger';
import { eventBus } from '../ui/EventBus';

export class Player {
    health: number;
    hunger: number;
    thirst: number;
    energy: number;
    morale: number;
    inventory: { [key: string]: number };
    currentEnvironment: string;
    day: number;
    distance: number;

    constructor() {
        this.health = 100;
        this.hunger = 100;
        this.thirst = 100;
        this.energy = 100;
        this.morale = 100;
        this.inventory = {};
        this.currentEnvironment = "Start";
        this.day = 1;
        this.distance = 0;
        Logger.info('Player created');
    }

    private emitAllStats() {
        eventBus.emit('playerStatsChanged', {
            health: this.health,
            hunger: this.hunger,
            thirst: this.thirst,
            energy: this.energy,
            morale: this.morale
        });
        eventBus.emit('playerInventoryChanged', { ...this.inventory });
        eventBus.emit('gameInfoChanged', {
            day: this.day,
            environment: this.currentEnvironment,
            distance: this.distance
        });
    }

    // Call this method once when the player is initialized in the scene
    public initialize() {
        this.emitAllStats();
    }

    takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount);
        Logger.warn(`Player took ${amount} damage. Health is now ${this.health}`);
        this.emitAllStats();
    }

    consumeFood(amount: number): void {
        this.hunger = Math.min(100, this.hunger + amount);
        Logger.info(`Hunger restored. Now at ${this.hunger}`);
        this.emitAllStats();
    }

     drinkWater(amount: number): void {
        this.thirst = Math.min(100, this.thirst + amount);
        Logger.info(`Thirst restored. Now at ${this.thirst}`);
        this.emitAllStats();
    }

    useEnergy(amount: number): void {
        this.energy = Math.max(0, this.energy - amount);
        Logger.debug(`Energy used. Now at ${this.energy}`);
        this.emitAllStats();
    }

    updateMorale(amount: number): void {
        this.morale = Math.min(100, this.morale + amount);
        Logger.info(`Morale updated. Now at ${this.morale}`);
        this.emitAllStats();
    }

    addItem(itemName: string, quantity: number = 1): void {
        this.inventory[itemName] = (this.inventory[itemName] || 0) + quantity;
        Logger.info(`Added ${quantity} ${itemName}(s).`, this.inventory);
        this.emitAllStats();
    }

    removeItem(itemName: string, quantity: number = 1): boolean {
        if ((this.inventory[itemName] || 0) >= quantity) {
            this.inventory[itemName] -= quantity;
            if (this.inventory[itemName] === 0) {
                delete this.inventory[itemName];
            }
            Logger.info(`Removed ${quantity} ${itemName}(s).`, this.inventory);
            this.emitAllStats();
            return true;
        }
        Logger.warn(`Not enough ${itemName} in inventory to remove.`);
        return false;
    }

    useItem(itemName: string): boolean {
        if (this.removeItem(itemName, 1)) {
            Logger.info(`Used ${itemName}.`);
            switch (itemName) {
                case 'Berries':
                    this.consumeFood(5);
                    return true;
                case 'Fish':
                    this.consumeFood(20);
                    return true;
                case 'Water':
                    this.drinkWater(10);
                    return true;
            }
        }
        return false;
    }

    public applyActionCosts(actionProps: { energy_cost: number, hunger_cost?: number, thirst_cost?: number, moral_cost?: number }): void {
        this.useEnergy(actionProps.energy_cost);
        if (actionProps.hunger_cost) {
            this.hunger = Math.max(0, this.hunger - actionProps.hunger_cost);
        }
        if (actionProps.thirst_cost) {
            this.thirst = Math.max(0, this.thirst - actionProps.thirst_cost);
        }
        if (actionProps.moral_cost) {
            this.updateMorale(-actionProps.moral_cost);
        }
    }

    updateDailyMetrics(): boolean {
        this.day += 1;
        this.energy = 100;

        this.hunger = Math.max(0, this.hunger - Phaser.Math.Between(10, 25));
        this.thirst = Math.max(0, this.thirst - Phaser.Math.Between(25, 34));
        this.morale = Math.max(0, this.morale - Phaser.Math.Between(5, 10));

        if (this.hunger <= 0) this.takeDamage(5);
        if (this.thirst <= 0) this.takeDamage(10);
        if (this.morale <= 0) this.takeDamage(3) 
            
        // Log a warning if any stat is getting low.
        if (this.hunger <= 30) {
            Logger.info(`Getting hungry?: ${this.hunger}%`);
        }
        if (this.thirst <= 30) {
            Logger.info(`You are thirsty: ${this.thirst}%`);
        }
        if (this.morale <= 30) {
            Logger.info(`Morale is getting low: ${this.morale}%`);
        }

        Logger.info(`--- Day ${this.day} Update ---`);
        Logger.info(`Health: ${this.health}, Hunger: ${this.hunger}, Energy: ${this.energy}, Morale: ${this.morale}`);

        this.emitAllStats();

        return this.health > 0;
    }

    changeEnvironment(newEnv: string) {
        this.currentEnvironment = newEnv;
        this.emitAllStats();
    }
}