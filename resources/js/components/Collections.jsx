import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Collections = () => {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Llamamos a la API de Laravel que creamos antes
        fetch('/api/sets')
            .then(res => res.json())
            .then(data => {
                setSets(data);
                setLoading(false);
            })
            .catch(err => console.error("Errorea set-ak kargatzean:", err));
    }, []);

    if (loading) return (
        <Container className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Bildumak kargatzen...</p>
        </Container>
    );

    return (
        <Container>
            <h2 className="my-4 fw-bold">ESKURAGARRI DAUDEN SET-AK 📚</h2>
            <Row>
                {sets.map((set) => (
                    <Col key={set.id} md={4} className="mb-4">
                        {/* Al hacer clic, vamos a la ruta dinámica del set */}
                        <Link to={`/bildumak/${set.id}`} className="text-decoration-none">
                            <Card className="bg-dark text-white border-0 overflow-hidden shadow-sm h-100 card-hover">
                                <Card.Img 
                                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${set.name}`} 
                                    alt={set.name} 
                                    style={{ opacity: '0.4', height: '200px', objectFit: 'cover' }} 
                                />
                                <Card.ImgOverlay className="d-flex flex-column align-items-center justify-content-center text-center">
                                    <Card.Title className="h3 mb-0 text-uppercase fw-bold">{set.name}</Card.Title>
                                    <small className="text-light opacity-75">{set.series || 'Pokémon TCG'}</small>
                                </Card.ImgOverlay>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Collections;