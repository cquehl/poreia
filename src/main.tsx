import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import { App } from './ui/App';
// import { Colors } from './game/Colors'

// Phaser game configuration
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    //backgroundColor: Colors.RED,
    transparent: true,
    scene: [MenuScene, GameScene, GameOverScene],
    scale: {
        // mode: Phaser.Scale.FIT,
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

// Render the React UI
const uiRoot = ReactDOM.createRoot(document.getElementById('ui-root')!);
uiRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);