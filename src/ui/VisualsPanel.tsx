// src/ui/VisualsPanel.tsx

import React, { useState, useEffect } from 'react';
import { eventBus, Events } from './EventBus';
// 1. Import the new asset map.
import { environmentImageAssets } from './visuals/imageAssets'; 

export const VisualsPanel: React.FC = () => {
    const [environment, setEnvironment] = useState('Start');

    useEffect(() => {
        const handleInfoChange = (newInfo: Events['gameInfoChanged']) => {
            setEnvironment(newInfo.environment);
        };

        eventBus.on('gameInfoChanged', handleInfoChange);

        return () => {
            eventBus.off('gameInfoChanged', handleInfoChange);
        };
    }, []);

    // 2. Use the new asset map to get the correct, Vite-processed image path.
    const currentImage = environmentImageAssets[environment] || environmentImageAssets['Placeholder'];

    return (
        <div className="panel visuals-panel">
            <img src={currentImage} alt={environment} className="visuals-image" />
        </div>
    );
};
