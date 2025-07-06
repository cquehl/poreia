import React, { useState, useEffect } from 'react';
import { eventBus } from './EventBus';
import { Hud } from './Hud';
import { Menu } from './Menu';
import { GameOver } from './GameOver';

type GameView = 'menu' | 'hud' | 'gameover';

export const App: React.FC = () => {
    const [view, setView] = useState<GameView>('menu');

    useEffect(() => {
        const handleViewChange = (newView: GameView) => {
            setView(newView);
        };
        eventBus.on('viewChanged', handleViewChange);
        return () => eventBus.off('viewChanged', handleViewChange);
    }, []);

    const renderView = () => {
        switch (view) {
            case 'hud':
                return <Hud />;
            case 'gameover':
                return <GameOver />;
            case 'menu':
            default:
                return <Menu />;
        }
    };

    return <div className="app-container">{renderView()}</div>;
};