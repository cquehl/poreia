import Phaser from 'phaser';

export interface ActionProps {
    energy_cost: number;
    success_rate: number;
    result_item?: string;
    quantity?: number;
    result_event?: string;
}

export class Environment {
    name: string;
    description: string;
    availableActions: { [key: string]: ActionProps };

    constructor(name: string, description: string, availableActions: { [key: string]: ActionProps }) {
        this.name = name;
        this.description = description;
        this.availableActions = availableActions;
    }
}

// Define environments
export const ENVIRONMENTS: { [key: string]: Environment } = {
    "Forest": new Environment(
        "Forest",
        "A dense forest, good for foraging.",
        {
            "Forage for Food": { energy_cost: 15, success_rate: 70, result_item: 'Berries', quantity: 0 }, // Quantity needs to be a function or set later
            "Gather Wood": { energy_cost: 10, success_rate: 90, result_item: 'Wood', quantity: 0 },
            "Scout Ahead": { energy_cost: 20, success_rate: 60, result_event: 'Discover New Area' }
        }
    ),
    "Riverbank": new Environment(
        "Riverbank",
        "A winding river, ideal for fishing.",
        {
            "Fish": { energy_cost: 20, success_rate: 60, result_item: 'Fish', quantity: 0 },
            "Collect Water": { energy_cost: 5, success_rate: 100, result_item: 'Water', quantity: 0 },
            "Search for Rare Herbs": { energy_cost: 25, success_rate: 30, result_item: 'Herbs', quantity: 1 }
        }
    )
};

// Helper to get random quantities for actions, since Pygame's random.randint was in the dict
export function getRandomActionQuantity(actionName: string): number {
    switch(actionName) {
        case "Forage for Food": return Phaser.Math.Between(1, 3);
        case "Gather Wood": return Phaser.Math.Between(2, 5);
        case "Fish": return Phaser.Math.Between(1, 2);
        case "Collect Water": return Phaser.Math.Between(1, 5);
        case "Search for Rare Herbs": return 1; // Fixed quantity for rare items
        default: return 1;
    }
}