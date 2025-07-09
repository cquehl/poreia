import React from 'react';
import { StatsPanel } from './StatsPanel';
import { InventoryPanel } from './InventoryPanel';
import { ActionsPanel } from './ActionsPanel';
import { MessagePanel } from './MessagePanel';
import './ui.css';

export const Hud: React.FC = () => {
    return (
        <div className="hud-container">
            <StatsPanel />
            <ActionsPanel />
            <InventoryPanel />
            <MessagePanel />
        </div>
    );
};