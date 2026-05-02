import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const AdminMessages = () => {
    const [usersWithTickets, setUsersWithTickets] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userMessages, setUserMessages] = useState([]);
    const [adminReply, setAdminReply] = useState('');

    useEffect(() => {
        fetchTicketsList();
    }, []);

    const fetchTicketsList = async () => {
        try {
            const response = await axios.get('/api/admin/messages/users');
            setUsersWithTickets(response.data);
        } catch (err) {
            console.error("Errorea erabiltzaileak kargatzean", err);
        }
    };

    const selectUserChat = async (user) => {
        setSelectedUser(user);
        try {
            const response = await axios.get(`/api/admin/messages/user/${user.id}`);
            setUserMessages(response.data);
        } catch (err) {
            console.error("Errorea elkarrizketa kargatzean", err);
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!adminReply.trim()) return;

        try {
            await axios.post('/api/admin/messages/reply', {
                user_id: selectedUser.id,
                message: adminReply
            });
            setAdminReply('');
            selectUserChat(selectedUser);
            fetchTicketsList();
        } catch (err) {
            console.error("Errorea mezua bidaltzean", err);
        }
    };

    return (
        <Container className="py-5" style={{ color: '#fff' }}>
            <style>{`
                .admin-card {
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 20px;
                }
                .message-list-item {
                    background: #1a1a1a;
                    border: 1px solid #222;
                    color: #fff;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .message-list-item:hover {
                    background: #222;
                    border-color: #facc15;
                }
                .chat-box {
                    background: #121212;
                    border: 1px solid #333;
                    height: 500px;
                    overflow-y: auto;
                    border-radius: 12px;
                    padding: 20px;
                }
                .msg-admin-chat {
                    background-color: #2b2413;
                    border: 1px solid #facc15;
                    color: #facc15;
                    margin-left: auto;
                    border-radius: 10px;
                    padding: 10px 15px;
                    margin-bottom: 12px;
                    max-width: 75%;
                }
                .msg-user-chat {
                    background-color: #1a1a1a;
                    border: 1px solid #444;
                    color: #fff;
                    margin-right: auto;
                    border-radius: 10px;
                    padding: 10px 15px;
                    margin-bottom: 12px;
                    max-width: 75%;
                }
                .btn-amara-yellow {
                    background: #facc15;
                    color: #000;
                    font-weight: bold;
                    border: none;
                }
                .btn-amara-yellow:hover {
                    background: #eab308;
                }
            `}</style>

            {/* Cabecera */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <span className="badge bg-warning text-dark px-2 py-1 mb-2">ADMIN MODE</span>
                    <h2>MEZUEN KUDEAKETA</h2>
                </div>
                <Link to="/admin" className="btn btn-dark border-secondary">
                    <FaArrowLeft className="me-2" /> Atzera
                </Link>
            </div>

            <Row className="g-4">
                <Col md={4}>
                    <Card className="p-3 admin-card h-100">
                        <h5 className="text-warning mb-3">Erabiltzaileak</h5>
                        <ListGroup variant="flush">
                            {usersWithTickets.map((user) => (
                                <ListGroup.Item 
                                    key={user.id}
                                    onClick={() => selectUserChat(user)}
                                    className={`message-list-item p-3 mb-2 d-flex justify-content-between align-items-center rounded-3 ${selectedUser?.id === user.id ? 'border-warning' : ''}`}
                                >
                                    <div>
                                        <strong className="d-block">{user.name}</strong>
                                        <small className="text-muted">{user.email}</small>
                                    </div>
                                    <Badge bg={user.unread_count > 0 ? "warning" : "secondary"}>
                                        {user.unread_count}
                                    </Badge>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>

                <Col md={8}>
                    {selectedUser ? (
                        <Card className="p-4 admin-card">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="text-white">Elkarrizketa: {selectedUser.name}</h5>
                                <Button variant="link" className="text-muted p-0" onClick={() => setSelectedUser(null)}>
                                    Itxi elkarrizketa
                                </Button>
                            </div>

                            <div className="chat-box mb-3 d-flex flex-column">
                                {userMessages.length === 0 ? (
                                    <p className="text-muted m-auto">Ez dago mezurik erabiltzaile honekin.</p>
                                ) : (
                                    userMessages.map((msg, i) => (
                                        <div key={i} className={msg.is_from_admin ? "msg-admin-chat" : "msg-user-chat"}>
                                            <span className="small d-block text-warning mb-1">
                                                {msg.is_from_admin ? "Zu (Admin)" : selectedUser.name}
                                            </span>
                                            <p className="mb-0">{msg.message}</p>
                                            <small className="d-block text-muted mt-2" style={{ fontSize: '0.65rem' }}>
                                                {msg.created_at}
                                            </small>
                                        </div>
                                    ))
                                )}
                            </div>

                            <Form onSubmit={handleSendReply}>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Idatzi erantzun bat..."
                                        className="bg-dark text-white border-secondary"
                                        value={adminReply}
                                        onChange={(e) => setAdminReply(e.target.value)}
                                        required
                                    />
                                    <Button type="submit" className="btn-amara-yellow">
                                        <FaPaperPlane />
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    ) : (
                        <div className="chat-box d-flex align-items-center justify-content-center text-muted">
                            <div>Aukeratu erabiltzaile bat mezuen historia ikusteko.</div>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AdminMessages;