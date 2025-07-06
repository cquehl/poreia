import React, { useState, useEffect } from 'react';
import { eventBus } from './EventBus';

export const MessageBox: React.FC = () => {
    const [message, setMessage] = useState('Welcome to the wilderness!');

    useEffect(() => {
        const handleMessage = (newMessage: string) => setMessage(newMessage);
        eventBus.on('messageChanged', handleMessage);
        return () => eventBus.off('messageChanged', handleMessage);
    }, []);

    return (
        <div className="panel message-box">
            <p>{message}</p>
        </div>
    );
};