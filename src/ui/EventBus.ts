import mitt from 'mitt';

// Define the types for the events you want to emit
export type Events = {
  // Phaser to React: Game state events
  viewChanged: 'menu' | 'hud' | 'gameover';
  playerStatsChanged: { health: number, hunger: number, thirst: number, energy: number, morale: number };
  playerInventoryChanged: { [key: string]: number };
  gameInfoChanged: { day: number, environment: string };
  messageChanged: string;
  gameOver: { message: string };

  // React to Phaser: UI action events
  startGame: void;
  restartGame: void;
  performAction: { actionName: string, actionProps: any };
  useItem: string;
  endDay: void;
};

// Create and export the event bus
export const eventBus = mitt<Events>();