import React, { useState, useEffect } from 'react';
import { eventBus, Events } from './EventBus';
// Import the "extra stuff" from the new visuals folder
import { environmentImages } from './visuals/environmentImages'; 

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

    // If a specific image exists use it, otherwise use the placeholder
    const currentImage = environmentImages[environment] || environmentImages['Placeholder'];

    return (
        <div className="panel visuals-panel">
            <img src={currentImage} alt={environment} className="visuals-image" />
        </div>
    );
};