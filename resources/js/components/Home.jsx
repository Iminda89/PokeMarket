import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';

const Home = () => {
    const { user } = useUser();
    const isAuthenticated = user && user.id;

    return (
        <div className="home-hero py-5 position-relative overflow-hidden">
            <style>{`
                /* Título con jerarquía Amara */
                .hero-title { 
                    font-weight: 900; 
                    line-height: 1.1; 
                    letter-spacing: -2px; 
                    color: white;
                }
                .text-blue-amara { color: #007bff; }

                /* Texto de descripción corregido para máxima legibilidad */
                .hero-subtitle { 
                    font-size: 1.25rem; 
                    color: #f8f9fa; /* Blanco roto para evitar fatiga visual */
                    opacity: 0.9; 
                    font-weight: 500;
                    margin-bottom: 2rem;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5); /* Sombra para resaltar sobre el fondo negro */
                }

                /* Botón Secundario estilo Amara (Gris ceniza sutil) */
                .btn-outline-amara {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: #bbbbbb;
                    padding: 12px 28px;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }

                .btn-outline-amara:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: #ffffff;
                    color: #ffffff;
                    transform: translateY(-2px);
                }

                /* Ajuste de la imagen para que destaque */
                .hero-img {
                    max-height: 450px;
                    filter: drop-shadow(0 0 50px rgba(0, 123, 255, 0.2));
                    transition: transform 0.5s ease;
                }
                .hero-img:hover {
                    transform: scale(1.05) rotate(2deg);
                }
            `}</style>

            <Container>
                <Row className="align-items-center min-vh-75">
                    <Col lg={7} className="text-start">
                        <h1 className="hero-title display-2 mb-4">
                            Zure Pokémon <br />
                            <span className="text-blue-amara">Bilduma</span> Hemen <br />
                            Hasten Da
                        </h1>

                        {/* Subtítulo corregido: Blanco brillante y sin caja azul que lo tape */}
                        <p className="hero-subtitle">
                            Munduko karta arraroenak eta <span className="fw-black text-white">PSA 10</span> onenak zure eskura.
                        </p>

                        <div className="d-flex gap-3 align-items-center">
                            <Button 
                                as={Link} 
                                to="/denda" 
                                className="btn-yellow-amara border-0 shadow-lg"
                                style={{ padding: '14px 35px' }}
                            >
                                DENDA IKUSI
                            </Button>

                            {/* Lógica: Solo se muestra si el usuario NO está autenticado */}
                            {!isAuthenticated && (
                                <Link to="/register" className="btn-outline-amara text-uppercase">
                                    Kontua Sortu
                                </Link>
                            )}
                        </div>
                    </Col>

                    <Col lg={5} className="text-center d-none d-lg-block">
                        <img 
                            src="https://images.pokemontcg.io/base1/4_hires.png" 
                            alt="Hero Charizard" 
                            className="hero-img img-fluid"
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Home;