import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Link from 'next/link';
import { isAuth } from '../../helpers/auth';

const socket = io('http://localhost:8000', {
    transports: ['websocket', 'polling']
});

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const auth = isAuth();
    const username = auth ? auth.name : "Guest";
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        socket.on('load_messages', (previousMessages) => {
            setMessages(previousMessages);
        });

        socket.on('receive_message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('connect');
            socket.off('load_messages');
            socket.off('receive_message');
        };
    }, []);

    useEffect(() => {
        // Scroll to the bottom when messages update
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (input) {
            const message = { text: input, user: username };
            socket.emit('send_message', message);
            setInput('');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F7F8FA',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            color: '#333',
            position: 'relative',
        }}>
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
            }}>
                <h2 style={{ margin: 0, color: '#007BFF' }}>Discussions</h2>
                <Link href="/user" style={{ color: '#007BFF', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
            </nav>

            <div className="chat-container" style={{
                marginTop: '20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '15px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                padding: '20px',
                overflow: 'hidden'
            }}>
                <div className="card-header" style={{
                    backgroundColor: '#F1F3F4',
                    textAlign: 'center',
                    padding: '10px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    fontSize: '18px',
                    fontWeight: '500'
                }}>
                    Live Chat
                </div>

                <div className="chat-messages" style={{
                    flex: '1',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse', // Reverse to display latest message at the bottom
                    paddingRight: '10px',
                }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{
                            backgroundColor: msg.user === username ? '#007BFF' : '#EAEAEA',
                            padding: '12px 18px',
                            borderRadius: '10px',
                            color: msg.user === username ? '#FFFFFF' : '#333',
                            alignSelf: msg.user === username ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            margin: '5px 0'
                        }}>
                            <strong>{msg.user}:</strong> {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} /> {/* Empty div to scroll into view */}
                </div>

                {/* Static Message Input */}
                <div className="message-input" style={{
                    position: 'relative', // Keep it relative
                    marginTop: '20px', // Constant distance from chat messages
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                }}>
                    <input
                        type="text"
                        style={{
                            flex: '1',
                            padding: '15px',
                            borderRadius: '30px',
                            border: '1px solid #ddd',
                            outline: 'none',
                            fontSize: '16px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
                        }}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
                        placeholder="Type your message..."
                    />
                    <button style={{
                        padding: '12px 25px',
                        borderRadius: '30px',
                        border: 'none',
                        backgroundColor: '#28A745',
                        color: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        transition: 'background-color 0.3s ease'
                    }} 
                    onClick={sendMessage}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28A745'}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
