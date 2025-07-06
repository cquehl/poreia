import { Player } from './Player';
import { Logger } from './Logger';

/**
 * Defines the structure for a daily event.
 */
export interface DailyEvent {
    day: number;
    message: string;
    action?: (player: Player) => void; // Optional function to modify player state
}

/**
 * A list of all scripted daily events in the game.
 */
const SCRIPTED_EVENTS: DailyEvent[] = [
    {
        day: 1,
        message: "\n The first night is always the hardest.",
    },
    {
        day: 3,
        message: "\n A storm is brewing on the horizon."
    },
    {
        day: 5,
        message: "\n You start to feel a deep sense of loneliness.",
        action: (player) => player.updateMorale(-25)
    },
    {
        day: 7,
        message: "\n A storm is brewing on the horizon."
    },
    {
        day: 10,
        message: "\n You've survived for so long. A flicker of hope returns.",
        action: (player) => player.updateMorale(40)
    }
];

/**
 * Manages and checks for daily scripted events.
 */
export class EventManager {
    /**
     * Checks if there is a scripted event for the current day.
     * If an event is found, its action is executed and its message is returned.
     * @param day The current day number.
     * @param player The player instance to potentially apply effects to.
     * @returns The event message string, or null if no event occurs.
     */
    public static checkForDailyEvent(day: number, player: Player): string | null {
        const event = SCRIPTED_EVENTS.find(e => e.day === day);

        if (event) {
            Logger.info(`Daily Event (Day ${day}): ${event.message}`);
            if (event.action) {
                event.action(player);
            }
            return event.message;
        }

        return null;
    }
}
