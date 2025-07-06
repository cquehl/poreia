import React, { useState, useEffect } from 'react';
import { eventBus } from './EventBus';

export const InventoryPanel: React.FC = () => {
    const [inventory, setInventory] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const handleInventoryChange = (newInventory: any) => setInventory(newInventory);
        eventBus.on('playerInventoryChanged', handleInventoryChange);
        return () => eventBus.off('playerInventoryChanged', handleInventoryChange);
    }, []);

    const handleUseItem = (itemName: string) => {
        eventBus.emit('useItem', itemName);
    };

    return (
        <div className="panel inventory-panel">
            <h3>Inventory</h3>
            <ul>
                {Object.keys(inventory).length > 0 ? (
                    Object.entries(inventory).map(([name, quantity]) =>
                        quantity > 0 ? (
                            <li key={name}>
                                {name}: {quantity}
                                <button className="clickable" onClick={() => handleUseItem(name)}>Use</button>
                            </li>
                        ) : null
                    )
                ) : (
                    <li>Empty</li>
                )}
            </ul>
        </div>
    );
};