import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => (
    <div className="home-hero py-5">
        <Container>
            <Row className="align-items-center">
                <Col md={6}>
                    <h1 className="display-3 fw-bold">Zure Pokémon <span className="text-primary">Bilduma</span> Hemen Hasten Da</h1>
                    <p className="lead text-muted">Munduko karta arraroenak eta PSA 10 onenak zure eskura.</p>
                    <div className="d-flex gap-3">
                        <Button as={Link} to="/denda" size="lg" variant="primary">Denda Ikusi</Button>
                        <Button as={Link} to="/register" size="lg" variant="outline-dark">Kontua Sortu</Button>
                    </div>
                </Col>
                <Col md={6} className="text-center">
                    {/* Aquí podrías poner una imagen de una carta flotando */}
                    <img src="https://images.pokemontcg.io/base1/4_hires.png" alt="Hero Charizard" style={{ maxHeight: '400px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }} />
                </Col>
            </Row>
        </Container>
    </div>
);

export default Home;