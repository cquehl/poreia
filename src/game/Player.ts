import Phaser from 'phaser';
// Removed unused imports: import { Environment, ActionProps } from './Environment';

export class Player {
    health: number;
    hunger: number;
    energy: number;
    morale: number;
    inventory: { [key: string]: number };
    currentEnvironment: string;
    day: number;

    constructor() {
        this.health = 100;
        this.hunger = 100;
        this.energy = 100;
        this.morale = 100;
        this.inventory = {};
        this.currentEnvironment = "Forest"; // Starting environment
        this.day = 1;
    }

    takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount);
        console.log(`Health: ${this.health}`);
    }

    consumeFood(amount: number): void {
        this.hunger = Math.min(100, this.hunger + amount);
        console.log(`Hunger: ${this.hunger}`);
    }

    useEnergy(amount: number): void {
        this.energy = Math.max(0, this.energy - amount);
        console.log(`Energy: ${this.energy}`);
    }

    updateMorale(amount: number): void {
        this.morale = Math.min(100, this.morale + amount);
        console.log(`Morale: ${this.morale}`);
    }

    addItem(itemName: string, quantity: number = 1): void {
        this.inventory[itemName] = (this.inventory[itemName] || 0) + quantity;
        console.log(`Added ${quantity} ${itemName}(s). Inventory:`, this.inventory);
    }

    removeItem(itemName: string, quantity: number = 1): boolean {
        if ((this.inventory[itemName] || 0) >= quantity) {
            this.inventory[itemName] -= quantity;
            if (this.inventory[itemName] === 0) {
                delete this.inventory[itemName];
            }
            console.log(`Removed ${quantity} ${itemName}(s). Inventory:`, this.inventory);
            return true;
        }
        console.log(`Not enough ${itemName} in inventory.`);
        return false;
    }

    updateDailyMetrics(): boolean {
        // Returns true if game should continue, false if game over
        this.day += 1;
        
        // Restore energy at the start of a new day
        this.energy = 100;

        // Decrease other stats
        this.hunger = Math.max(0, this.hunger - Phaser.Math.Between(10, 20));
        this.morale = Math.max(0, this.morale - Phaser.Math.Between(5, 10));

        if (this.hunger <= 0) {
            this.takeDamage(5); // Take damage if starving
        }

        console.log(`--- Day ${this.day} Update ---`);
        console.log(`Health: ${this.health}, Hunger: ${this.hunger}, Energy: ${this.energy}, Morale: ${this.morale}`);

        return this.health > 0; // Game continues if health > 0
    }
}