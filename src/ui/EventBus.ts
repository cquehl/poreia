import mitt from 'mitt';

// Define the types for the events you want to emit
type Events = {
  // Game state events
  playerStatsChanged: { health: number, hunger: number, thirst: number, energy: number, morale: number };
  playerInventoryChanged: { [key: string]: number };
  gameInfoChanged: { day: number, environment: string };
  messageChanged: string;

  // UI action events
  performAction: { actionName: string, actionProps: any };
  useItem: string;
  endDay: void;
};

// Create and export the event bus
export const eventBus = mitt<Events>();