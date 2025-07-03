import Phaser from 'phaser';

export interface ActionProps {
    energy_cost: number;
    success_rate: number;
    result_item?: string;
    quantity?: number;
    result_event?: string;
    required_item?: string;
}

const BASE_ACTIONS: { [key: string]: ActionProps } = {
    "Scout Ahead": { energy_cost: 20, success_rate: 60, result_event: 'Discover New Area' },
    "Make Fire": { energy_cost: 25, success_rate: 80, result_event: 'Fire Started', required_item: 'Wood' }
};

export class Environment {
    name: string;
    description: string;
    availableActions: { [key: string]: ActionProps };

    constructor(name: string, description: string, availableActions: { [key: string]: ActionProps }) {
        this.name = name;
        this.description = description;
        this.availableActions = {...BASE_ACTIONS, ...availableActions};
    }
}

// Define environments
export const ENVIRONMENTS: { [key: string]: Environment } = {
    "Forest": new Environment(
        "Forest",
        "A dense forest. You can hear a stream nearby.",
        {
            "Forage for Food": { energy_cost: 15, success_rate: 70, result_item: 'Berries' },
            "Gather Wood": { energy_cost: 10, success_rate: 90, result_item: 'Wood' },
            "Gather Water": { energy_cost: 5, success_rate: 95, result_item: 'Water' },
            "Scout Ahead": { energy_cost: 20, success_rate: 60, result_event: 'Discover New Area' }
        }
    ),
    "Riverbank": new Environment(
        "Riverbank",
        "A winding river, ideal for fishing.",
        {
            "Fish": { energy_cost: 20, success_rate: 60, result_item: 'Fish' },
            "Collect Water": { energy_cost: 5, success_rate: 100, result_item: 'Water' },
            "Search for Rare Herbs": { energy_cost: 25, success_rate: 30, result_item: 'Herbs' }
        }
    ),
    "Cave": new Environment(
        "Cave",
        "A dark, damp cave. Strange noises echo from the depths.",
        {
            "Explore Deeper": { energy_cost: 30, success_rate: 40, result_event: 'Find Rare Minerals' },
            "Rest in Shelter": { energy_cost: -20, success_rate: 100, result_event: 'Restore Morale' },
            "Search for Water Drips": { energy_cost: 10, success_rate: 50, result_item: 'Water' }
        }
    ),
    "Mountain Pass": new Environment(
        "Mountain Pass",
        "A treacherous and windy mountain pass. The air is thin.",
        {
            "Hunt for Goats": { energy_cost: 35, success_rate: 40, result_item: 'Meat' },
            "Find Shelter from Wind": { energy_cost: 15, success_rate: 80, result_event: 'Reduce Morale Loss' },
            "Look for Rare Minerals": { energy_cost: 25, success_rate: 20, result_item: 'Minerals' }
        }
    ),
    "Deserted Shack": new Environment(
        "Deserted Shack",
        "An old, abandoned shack. It might contain useful supplies.",
        {
            "Scavenge for Supplies": { energy_cost: 15, success_rate: 60, result_item: 'Canned Food' },
            "Reinforce Shelter": { energy_cost: 20, success_rate: 90, result_event: 'Improved Shelter' },
            "Break Down for Firewood": { energy_cost: 25, success_rate: 70, result_item: 'Wood' }
        }
    ),
    "Swamp": new Environment(
        "Swamp",
        "A murky, humid swamp. The ground is unstable.",
        {
            "Gather Swamp Plants": { energy_cost: 15, success_rate: 50, result_item: 'Swamp Plants' },
            "Set a Trap": { energy_cost: 20, success_rate: 70, result_event: 'Trap Set' },
            "Filter Swamp Water": { energy_cost: 10, success_rate: 40, result_item: 'Water' }
        }
    )
};

// Helper to get random quantities for actions
export function getRandomActionQuantity(actionName: string): number {
    switch(actionName) {
        case "Forage for Food": return Phaser.Math.Between(1, 3);
        case "Gather Wood": return Phaser.Math.Between(2, 5);
        case "Fish": return Phaser.Math.Between(1, 2);
        case "Collect Water": return Phaser.Math.Between(1, 5);
        case "Gather Water": return Phaser.Math.Between(1, 4);
        case "Search for Rare Herbs": return 1;
        case "Hunt for Goats": return Phaser.Math.Between(1, 2);
        case "Look for Rare Minerals": return 1;
        case "Scavenge for Supplies": return Phaser.Math.Between(1, 2);
        case "Break Down for Firewood": return Phaser.Math.Between(1, 3);
        case "Gather Swamp Plants": return Phaser.Math.Between(1, 4);
        case "Search for Water Drips": return Phaser.Math.Between(1, 1);
        default: return 1;
    }
}