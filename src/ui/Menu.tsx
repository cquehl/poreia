import React from 'react';
import { eventBus } from './EventBus';

export const Menu: React.FC = () => {

    const handleStart = () => {
        eventBus.emit('startGame');
    };

    return (
        <div className="menu-container">
            <h1 className="title-green">Wilderness Survival</h1>
            <button className="clickable" onClick={handleStart}>Start Game</button>
            <button className="clickable" disabled>Credits</button>
        </div>
    );
};