import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import { Hud } from './ui/Hud';

// Phaser game configuration
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: [MenuScene, GameScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Start the Phaser game and assign to a constant to satisfy the linter
const game = new Phaser.Game(config);

// Render the React UI
const uiRoot = ReactDOM.createRoot(document.getElementById('ui-root')!);
uiRoot.render(
  <React.StrictMode>
    <Hud />
  </React.StrictMode>
);

// Global color definitions
export const Colors = {
    WHITE: 0xFFFFFF,
    BLACK: 0x000000,
    GRAY: 0x323232,
    LIGHT_GRAY: 0x969696,
    GREEN: 0x00C800,
    DARK_GREEN: 0x006400,
    RED: 0xC80000,
    BLUE: 0x0000C8,
    DARK_BLUE: 0x00008B,
    DARKER_BLUE: 0x000061,
    UI_BACKGROUND: 0x2a2a2a,
    YELLOW: 0xFFFF00
};