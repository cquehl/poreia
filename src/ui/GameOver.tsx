import React, { useState, useEffect } from 'react';
import { eventBus } from './EventBus';

export const GameOver: React.FC = () => {
    const [message, setMessage] = useState('You succumbed to the wilderness...');

    useEffect(() => {
        const handleGameOver = (data: { message: string }) => {
            setMessage(data.message);
        };
        eventBus.on('gameOver', handleGameOver);
        return () => eventBus.off('gameOver', handleGameOver);
    }, []);

    const handleRestart = () => {
        eventBus.emit('restartGame');
    };

    return (
        <div className="menu-container game-over">
            <h1>GAME OVER</h1>
            <p>{message}</p>
            <button className="clickable" onClick={handleRestart}>Return to Menu</button>
        </div>
    );
};