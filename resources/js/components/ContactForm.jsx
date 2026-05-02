import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

function ContactForm() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('/api/user/messages');
            setMessages(response.data);
        } catch (err) {
            console.error("Errorea mezuak kargatzean:", err);
        }
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setMessage('');
        setError('');

        try {
            const response = await axios.post('/api/user/messages', { message: newMessage });
            setMessage(response.data.message);
            setNewMessage('');
            setValidated(false);
            fetchMessages();
        } catch (err) {
            setError(err.response?.data?.message || 'Ezin izan da mezua bidali.');
        }
    };

    return (
        <Container className="py-5">
            <style>{`
                .contact-box { 
                    background: #111; 
                    border: 1px solid #222; 
                    border-radius: 20px; 
                    padding: 30px;
                }
                .form-label-amara { 
                    color: #facc15; 
                    font-weight: 700; 
                    text-transform: uppercase; 
                    font-size: 0.8rem; 
                    letter-spacing: 1px;
                }
                .form-control-amara { 
                    background: #1a1a1a !important; 
                    border: 1px solid #333 !important; 
                    color: white !important; 
                    border-radius: 10px; 
                    padding: 12px;
                }
                .form-control-amara:focus { 
                    border-color: #facc15 !important; 
                    box-shadow: none; 
                }
                .section-title { 
                    font-weight: 900; 
                    letter-spacing: -1px; 
                    text-transform: uppercase; 
                    color: white;
                }
                .chat-history {
                    max-height: 350px;
                    overflow-y: auto;
                    background: #121212;
                    border-radius: 12px;
                    border: 1px solid #222;
                    padding: 20px;
                }
                .msg-bubble {
                    border-radius: 12px;
                    padding: 12px 16px;
                    margin-bottom: 15px;
                    max-width: 80%;
                    font-size: 0.9rem;
                }
                .msg-user {
                    background-color: #facc15;
                    color: #000;
                    margin-left: auto;
                }
                .msg-admin {
                    background-color: #1a1a1a;
                    color: #fff;
                    border: 1px solid #333;
                    margin-right: auto;
                }
            `}</style>

            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <div className="text-center mb-5">
                        <h2 className="section-title fs-1">BEZEROAREN <span className="text-yellow">ARRETA</span></h2>
                        <p className="text-muted">Zure zalantza edo intzidentzia zuzenean kudeatuko dugu</p>
                    </div>

                    {message && <Alert variant="success" className="bg-success text-white border-0">{message}</Alert>}
                    {error && <Alert variant="danger" className="bg-danger text-white border-0">{error}</Alert>}

                    {/* Historial de mensajes */}
                    <div className="chat-history mb-4 d-flex flex-column">
                        {messages.length === 0 ? (
                            <p className="text-muted text-center my-auto">Ez dago mezurik oraindik. Idatzi zure lehena behean.</p>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className={`msg-bubble ${msg.is_from_admin ? 'msg-admin' : 'msg-user'}`}>
                                    <strong>{msg.sender_name}:</strong>
                                    <p className="mb-0 mt-1">{msg.message}</p>
                                    <small className="opacity-75 d-block mt-2" style={{ fontSize: '0.75rem' }}>{msg.created_at}</small>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Formulario de envio */}
                    <Form noValidate validated={validated} onSubmit={handleSendMessage} className="contact-box shadow-lg">
                        <Form.Group className="mb-4">
                            <Form.Label className="form-label-amara">Idatzi zure mezua</Form.Label>
                            <Form.Control 
                                required 
                                as="textarea" 
                                rows={3} 
                                placeholder="Nola lagundu diezaiokegu gaur?"
                                className="form-control-amara"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">Mezua ezin da hutsik egon.</Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit" className="btn-yellow-amara w-100 py-3 mt-2" style={{ backgroundColor: '#facc15', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '10px' }}>
                            BIDALI MEZUA
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default ContactForm;