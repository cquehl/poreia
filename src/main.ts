import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';

// --- Configuration ---
// These could be in a separate config.ts if preferred, but for a jam,
// keeping them here is fine for simplicity.
const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 700;

// Phaser game configuration
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, // AUTO tries WebGL first, then Canvas
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000000', // BLACK
    parent: 'game-container', // ID of the HTML element to inject the canvas into (optional)
    scene: [MenuScene, GameScene, GameOverScene], // Order matters for scene start
    physics: {
        default: 'arcade', // Simple arcade physics if needed later (not strictly required for this type of game)
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT, // Scale to fit the window
        autoCenter: Phaser.Scale.CENTER_BOTH // Center the game canvas
    }
};

// Start the Phaser game
const game = new Phaser.Game(config);

// Global color definitions (for convenience, not a Phaser standard)
export const Colors = {
    WHITE: 0xFFFFFF,
    BLACK: 0x000000,
    GRAY: 0x323232, // 50, 50, 50
    LIGHT_GRAY: 0x969696, // 150, 150, 150
    GREEN: 0x00C800, // 0, 200, 0
    DARK_GREEN: 0x006400, // 0, 100, 0
    RED: 0xC80000, // 200, 0, 0
    BLUE: 0x0000C8, // 0, 0, 200
    DARK_BLUE: 0x00008B,    // A nice dark blue
    DARKER_BLUE: 0x000061,  // For hover effect
    UI_BACKGROUND: 0x2a2a2a, // Dark gray for UI panels
    YELLOW: 0xFFFF00
};

// Global player and environment definitions (accessed by scenes)
// We'll manage these instances directly in the main GameScene's create method
// or pass them around via scene data. For a game jam, keeping them accessible
// from the scene where they are primarily used is often simplest.