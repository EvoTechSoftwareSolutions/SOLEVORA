import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Messages.css';
import { API_URL, BASE_URL, getImageUrl } from '../config/api';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [sendingReply, setSendingReply] = useState(false);
// fetch messages from API
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${API_URL}/contact`);
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        // Silent background refresh every 15 seconds
        const interval = setInterval(() => {
            axios.get(`${API_URL}/contact`)
                .then(response => {
                    setMessages(response.data);
                })
                .catch(err => console.error('Silent fetch failed', err));
        }, 15000);
        return () => clearInterval(interval);
    }, []);
// mark message as read in backend
    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`${API_URL}/contact/${id}/read`);
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
        setReplyText("");
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        setSendingReply(true);
        try {
            // Here we assume there's an endpoint to send reply, or we use a general email sender
            // For now, let's assume we have a reply endpoint or we'll add one to contact controller
            await axios.post(`${API_URL}/contact/${selectedMessage.id}/reply`, {
                reply: replyText
            });
            alert("Reply sent successfully!");
            closeModal();
        } catch (error) {
            console.error("Error sending reply:", error);
            alert("Failed to send reply.");
        } finally {
            setSendingReply(false);
        }
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
                        <div className="modal-footer" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="reply-section" style={{ width: '100%', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                <h4 style={{ fontSize: '13px', marginBottom: '10px' }}>Reply to Customer</h4>
                                <textarea 
                                    className="reply-textarea"
                                    placeholder="Type your message here..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', resize: 'none', fontSize: '14px' }}
                                />
                                <button 
                                    className="send-reply-btn"
                                    onClick={handleSendReply}
                                    disabled={sendingReply || !replyText.trim()}
                                    style={{ marginTop: '10px', padding: '10px 20px', background: '#f66d3b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    {sendingReply ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                            <button className="btn-close" onClick={closeModal} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
