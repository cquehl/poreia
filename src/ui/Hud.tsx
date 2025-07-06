import React from 'react';
import { StatsPanel } from './StatsPanel';
import { InventoryPanel } from './InventoryPanel';
import { ActionsPanel } from './ActionsPanel';
import { MessageBox } from './MessageBox';
import './ui.css';

export const Hud: React.FC = () => {
    return (
        <div className="hud-container">
            <div className="top-section">
                <StatsPanel />
                <ActionsPanel />
            </div>
            <div className="bottom-section">
                <InventoryPanel />
                <MessageBox />
            </div>
        </div>
    );
};