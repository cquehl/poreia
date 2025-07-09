import React, { useState, useEffect, useRef } from 'react';
import { eventBus } from './EventBus';

type Message = {
    id: number;
    text: string;
};

export const MessagePanel: React.FC = () => {
    // 1. State is now an array of strings
    const [messages, setMessages] = useState<Message[]>([
        { id: 0, text: 'Welcome to the wilderness!' }
    ]);
    
    const nextId = useRef(1);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMessage = (newMessage: string) => {
            setMessages(prevMessages => 
                [...prevMessages, { id: nextId.current++, text: newMessage }].slice(-100)
            );
        };

        eventBus.on('messageChanged', handleMessage);
        return () => eventBus.off('messageChanged', handleMessage);
    }, []);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        // The component name was likely changed to MessagePanel here as well
        <div className="panel message-panel"> {/* You might want to rename the class too */}
            {/* 4. Render the list, using the unique message.id as the key. */}
            {messages.map((msg) => (
                <p key={msg.id}>{msg.text}</p>
            ))}
            <div ref={endOfMessagesRef} />
        </div>
    );
};