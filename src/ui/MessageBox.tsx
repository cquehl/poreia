import React, { useState, useEffect, useRef } from 'react';
import { eventBus } from './EventBus';

export const MessageBox: React.FC = () => {
    // 1. State is now an array of strings
    const [messages, setMessages] = useState<string[]>(['Welcome to the wilderness!']);
    
    // 2. A ref to help with auto-scrolling
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 3. The handler now appends messages to the array
        const handleMessage = (newMessage: string) => {
            setMessages(prevMessages => 
                // Keep the last 100 messages to prevent the list from growing forever
                [...prevMessages, newMessage].slice(-100)
            );
        };

        eventBus.on('messageChanged', handleMessage);
        return () => eventBus.off('messageChanged', handleMessage);
    }, []);

    // 4. This effect scrolls to the bottom whenever a new message is added
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="panel message-box">
            {/* 5. Render the list of messages */}
            {messages.map((msg, index) => (
                <p key={index}>{msg}</p>
            ))}
            {/* This empty div is the target for our auto-scroll */}
            <div ref={endOfMessagesRef} />
        </div>
    );
};