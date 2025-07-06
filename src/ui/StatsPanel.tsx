import React, { useState, useEffect } from 'react';
import { eventBus, Events } from './EventBus'; // Import the 'Events' type

export const StatsPanel: React.FC = () => {
    const [stats, setStats] = useState({ health: 100, hunger: 100, thirst: 100, energy: 100, morale: 100 });
    const [info, setInfo] = useState({ day: 1, environment: 'Start', distance: 0 });

    useEffect(() => {
        // Use the specific types from the 'Events' definition
        const handleStatsChange = (newStats: Events['playerStatsChanged']) => setStats(newStats);
        const handleInfoChange = (newInfo: Events['gameInfoChanged']) => setInfo(newInfo);

        eventBus.on('playerStatsChanged', handleStatsChange);
        eventBus.on('gameInfoChanged', handleInfoChange);

        return () => {
            eventBus.off('playerStatsChanged', handleStatsChange);
            eventBus.off('gameInfoChanged', handleInfoChange);
        };
    }, []);

    return (
        <div className="panel stats-panel">
            <h3>{info.environment} (Day: {info.day})</h3>
            <p>Health: {stats.health}%</p>
            <p>Hunger: {stats.hunger}%</p>
            <p>Thirst: {stats.thirst}%</p>
            <p>Energy: {stats.energy}%</p>
            <p>Morale: {stats.morale}%</p>
            <p>Traveled: {info.distance} miles</p>
        </div>
    );
};