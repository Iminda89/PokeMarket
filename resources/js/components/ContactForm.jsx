import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function ContactForm() {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    return (
        <Container className="py-5">
            <style>{`
                .contact-box { 
                    background: #111; 
                    border: 1px solid #222; 
                    border-radius: 20px; 
                    padding: 40px;
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
                .form-control-amara::placeholder { 
                    color: #444 !important; 
                }
                .section-title { 
                    font-weight: 900; 
                    letter-spacing: -1px; 
                    text-transform: uppercase; 
                    color: white;
                }
                .text-amara-muted { 
                    color: #aaaaaa !important; 
                }
            `}</style>

            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="text-center mb-5">
                        <h2 className="section-title fs-1">JARRI <span className="text-yellow">HARREMANETAN</span></h2>
                        <p className="text-amara-muted">Zalantzarik baduzu, idatzi iezaguzu eta lehenbailehen erantzungo dizugu.</p>
                    </div>

                    <Form noValidate validated={validated} onSubmit={handleSubmit} className="contact-box shadow-lg">
                        <Form.Group className="mb-4">
                            <Form.Label className="form-label-amara">Izena</Form.Label>
                            <Form.Control 
                                required 
                                type="text" 
                                placeholder="Zure izena idatzi..." 
                                className="form-control-amara"
                            />
                            <Form.Control.Feedback type="invalid">Mesedez, idatzi zure izena.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="form-label-amara">Posta elektronikoa</Form.Label>
                            <Form.Control 
                                required 
                                type="email" 
                                placeholder="adibidea@email.com" 
                                className="form-control-amara"
                            />
                            <Form.Control.Feedback type="invalid">Email baliozkoa behar da.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="form-label-amara">Mezua</Form.Label>
                            <Form.Control 
                                required 
                                as="textarea" 
                                rows={4} 
                                placeholder="Nola lagundu zaitzakegu?"
                                className="form-control-amara"
                            />
                            <Form.Control.Feedback type="invalid">Mezua ezin da hutsik egon.</Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit" className="btn-yellow-amara w-100 py-3 mt-2">
                            BIDALI MEZUA
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default ContactForm;