import React, { useState, useEffect } from 'react';
import { eventBus } from './EventBus';
import { ENVIRONMENTS } from '../game/Environment';

export const ActionsPanel: React.FC = () => {
    const [environment, setEnvironment] = useState('Start');
    const [inventory, setInventory] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const handleInfoChange = (newInfo: any) => setEnvironment(newInfo.environment);
        const handleInventoryChange = (newInv: any) => setInventory(newInv);
        eventBus.on('gameInfoChanged', handleInfoChange);
        eventBus.on('playerInventoryChanged', handleInventoryChange);
        return () => {
            eventBus.off('gameInfoChanged', handleInfoChange);
            eventBus.off('playerInventoryChanged', handleInventoryChange);
        };
    }, []);

    const handleActionClick = (actionName: string, actionProps: any) => {
        eventBus.emit('performAction', { actionName, actionProps });
    };

    const handleEndDayClick = () => {
        eventBus.emit('endDay');
    };

    const availableActions = ENVIRONMENTS[environment]?.availableActions || {};

    return (
        <div className="panel actions-panel">
            <h3>Actions</h3>
            <div className="actions-grid">
                {Object.entries(availableActions).map(([name, props]) => {
                    if (props.required_item && !inventory[props.required_item]) {
                        return null; // Skip action if required item is missing
                    }
                    return (
                        <button key={name} className="clickable" onClick={() => handleActionClick(name, props)}>
                            {name}
                        </button>
                    );
                })}
            </div>
            <button className="clickable end-day-button" onClick={handleEndDayClick}>
                Rest Untill Tomorrow
            </button>
        </div>
    );
};