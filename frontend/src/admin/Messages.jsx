import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Messages.css';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
// fetch messages from API
    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/contact');
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);
// mark message as read in backend
    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/contact/${id}/read`);
            setMessages(messages.map(msg => 
                msg.id === id ? { ...msg, isRead: true } : msg
            ));
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
    };
// open message modal
    const handleViewMessage = (msg) => {
        setSelectedMessage(msg);
        if (!msg.isRead) {
            handleMarkAsRead(msg.id);
        }
    };
// close modal
    const closeModal = () => {
        setSelectedMessage(null);
    };

    if (loading) return <div className="messages-loading">Loading messages...</div>;

    return (
        <div className="messages-container">
            {/* page header */}
            <div className="messages-header">
                <h2>Customer Messages</h2>
                <p>View and manage contact us messages</p>
            </div>
           {/* if no messages */}
            <div className="messages-list">
                {messages.length === 0 ? (
                    <div className="no-messages">No messages found.</div>
                ) : (
                    <table className="messages-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(msg => (
                                <tr key={msg.id} className={msg.isRead ? 'message-read' : 'message-unread'}>
                                    <td>
                                        <div className={`status-dot ${msg.isRead ? 'read' : 'unread'}`}></div>
                                    </td>
                                    <td>{new Date(msg.createdAt).toLocaleString()}</td>
                                    <td>{msg.name}</td>
                                    <td>{msg.email}</td>
                                    <td>{msg.subject || 'General'}</td>
                                    <td>
                                        <button className="view-btn" onClick={() => handleViewMessage(msg)}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
{/* modal (only show when message selected) */}
            {selectedMessage && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Message Details</h3>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="msg-detail-row">
                                <strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})
                            </div>
                            <div className="msg-detail-row">
                                <strong>Phone:</strong> {selectedMessage.phone || 'N/A'}
                            </div>
                            <div className="msg-detail-row">
                                <strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}
                            </div>
                            <div className="msg-detail-row">
                                <strong>Subject:</strong> {selectedMessage.subject || 'General'}
                            </div>
                            <div className="msg-content-box">
                                {selectedMessage.message}
                            </div>
                        </div>
                        {/* footer */}
                        <div className="modal-footer">
                            <button className="btn-close" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
