import Phaser from 'phaser';
import { Logger } from './Logger';

export class Player {
    health: number;
    hunger: number;
    thirst: number;
    energy: number;
    morale: number;
    inventory: { [key: string]: number };
    currentEnvironment: string;
    day: number;

    constructor() {
        this.health = 100;
        this.hunger = 100;
        this.thirst = 100;
        this.energy = 100;
        this.morale = 100;
        this.inventory = {};
        this.currentEnvironment = "Forest"; // Starting environment
        this.day = 1;
        Logger.info('Player created');
    }

    takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount);
        Logger.warn(`Player took ${amount} damage. Health is now ${this.health}`);
    }

    consumeFood(amount: number): void {
        this.hunger = Math.min(100, this.hunger + amount);
        Logger.info(`Hunger restored. Now at ${this.hunger}`);
    }

     drinkWater(amount: number): void {
        this.thirst = Math.min(100, this.thirst + amount);
        Logger.info(`Thirst restored. Now at ${this.thirst}`);
    }

    useEnergy(amount: number): void {
        this.energy = Math.max(0, this.energy - amount);
        Logger.debug(`Energy used. Now at ${this.energy}`);
    }

    updateMorale(amount: number): void {
        this.morale = Math.min(100, this.morale + amount);
        Logger.info(`Morale updated. Now at ${this.morale}`);
    }

    addItem(itemName: string, quantity: number = 1): void {
        this.inventory[itemName] = (this.inventory[itemName] || 0) + quantity;
        Logger.info(`Added ${quantity} ${itemName}(s).`, this.inventory);
    }

    removeItem(itemName: string, quantity: number = 1): boolean {
        if ((this.inventory[itemName] || 0) >= quantity) {
            this.inventory[itemName] -= quantity;
            if (this.inventory[itemName] === 0) {
                delete this.inventory[itemName];
            }
            Logger.info(`Removed ${quantity} ${itemName}(s).`, this.inventory);
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
                    this.consumeFood(20);
                    return true;
                case 'Fish':
                    this.consumeFood(40);
                    return true;
                case 'Water':
                    this.drinkWater(30);
                    return true;
            }
        }
        return false;
    }

    updateDailyMetrics(): boolean {
        this.day += 1;
        this.energy = 100; // Restore energy at the start of a new day

        this.hunger = Math.max(0, this.hunger - Phaser.Math.Between(10, 15));
        this.thirst = Math.max(0, this.thirst - Phaser.Math.Between(15, 20));
        this.morale = Math.max(0, this.morale - Phaser.Math.Between(5, 10));

        if (this.hunger <= 0) this.takeDamage(5);
        if (this.thirst <= 0) this.takeDamage(10);

        Logger.info(`--- Day ${this.day} Update ---`);
        Logger.info(`Health: ${this.health}, Hunger: ${this.hunger}, Energy: ${this.energy}, Morale: ${this.morale}`);

        return this.health > 0;
    }
}