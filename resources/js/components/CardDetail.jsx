import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap'; // Añadido Spinner
import { useUser } from './UserContext';

const CardDetail = () => {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();

    const [card, setCard] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true); // Estado para controlar la carga

    // Función para añadir/quitar de la colección
    const handleCollection = () => {
        if (!user) {
            alert("Mesedez, hasi saioa kartak gehitzeko.");
            navigate('/login');
            return;
        }

        axios.post(`/api/cards/${id}/collection`)
            .then(res => {
                alert(res.data.message);
            })
            .catch(err => {
                console.error(err);
                if (err.response?.status === 401) {
                    // Si llegamos aquí con un 401, es que Laravel ha perdido nuestra sesión
                    alert("Zure saioa iraungi da. Mesedez, hasi saioa berriro.");
                    navigate('/login');
                } else {
                    alert("Errorea karta gehitzean.");
                }
            });
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/cards/${id}`, {
            headers: { 'Accept': 'application/json' }
        })
        .then(res => {
            if (typeof res.data === 'string') {
                console.error("Error: Recibido HTML en lugar de JSON.");
                setError(true);
            } else {
                setCard(res.data);
            }
        })
        .catch(err => {
            console.error("Error en la petición:", err);
            setError(true);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [id]);

    // 1. Estado de carga (Spinner para que no se vea la pantalla vacía)
    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 fw-bold">Karta kargatzen...</p>
            </Container>
        );
    }

    // 2. Estado de error
    if (error || !card) {
        return (
            <Container className="py-5 text-center">
                <h2 className="text-danger">Akatsa: Ezin izan da karta kargatu</h2>
                <Button onClick={() => navigate(-1)} variant="primary" className="mt-3">Atzera joan</Button>
            </Container>
        );
    }

    // 3. Variables calculadas de forma segura
    const cardNumber = card.number ? card.number.split('/')[0] : '?';
    const prices = card.psa_prices || [];

    return (
        <Container className="py-5 bg-white shadow-sm rounded mt-4">
            {/* Cabecera */}
            <div className="mb-4 border-bottom pb-2 text-start">
                <h2 className="text-primary fw-bold">
                    {card.name} #{cardNumber} 
                    <span className="text-muted ms-3 fs-5 text-decoration-underline cursor-pointer">
                        {card.collection || 'Bilduma ezezaguna'}
                    </span>
                </h2>
            </div>

            <Row className="mb-5 align-items-center">
                {/* Columna Izquierda: Imagen y Botones */}
                <Col md={4} className="text-center">
                    <img 
                        src={card.image_url || 'https://via.placeholder.com/400x560?text=No+Image'} 
                        alt={card.name} 
                        className="img-fluid rounded shadow mb-3" 
                        style={{ maxHeight: '400px', width: 'auto' }} 
                    />
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        <Button onClick={handleCollection} variant="primary" size="sm" className="fw-bold">
                            + Colección
                        </Button>
                        <Button variant="info" size="sm" className="text-white fw-bold">
                            + Deseos
                        </Button>
                        <Button variant="dark" size="sm" className="fw-bold">
                            Comprarlo
                        </Button>
                    </div>
                </Col>

                {/* Columna Derecha: Gráfico Simulado */}
                <Col md={8}>
                    <div className="border rounded p-3 bg-light h-100">
                        <div className="d-flex gap-3 mb-3 small fw-bold text-muted">
                            <span>Zoom</span> <span className="text-primary">6m</span> <span>1y</span> <span className="bg-primary text-white px-2 rounded">5y</span> <span>All</span>
                        </div>
                        <div className="position-relative" style={{ height: '250px', borderBottom: '2px solid #ccc' }}>
                            <svg viewBox="0 0 500 100" className="w-100 h-100">
                                <path d="M0,80 Q50,20 100,70 T200,40 T300,60 T400,20 T500,50" fill="none" stroke="#007bff" strokeWidth="2" />
                            </svg>
                            <div className="position-absolute bottom-0 start-0 small text-muted">Jul 2021</div>
                            <div className="position-absolute bottom-0 end-0 small text-muted">Ene 2026</div>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Fila de Precios PSA */}
            <h4 className="fw-bold mb-3 text-start">Mercado de Precios</h4>
            <Row className="g-0 border text-center">
                {prices.length > 0 ? (
                    prices.map((item, index) => (
                        <Col key={index} className="border-end p-3 bg-white hover-shadow transition">
                            <div className="fw-bold text-dark small">{item.grade}</div>
                            <div className="fs-4 fw-black text-primary">${item.price}</div>
                            <div className="very-small text-muted text-decoration-underline">volume: {item.volume}</div>
                        </Col>
                    ))
                ) : (
                    <Col className="p-3 text-muted italic">Ez dago preziorik eskuragarri une honetan.</Col>
                )}
                <Col 
                    onClick={handleCollection} 
                    className="bg-primary d-flex align-items-center justify-content-center text-white fs-2 cursor-pointer" 
                    style={{ minHeight: '80px', borderLeft: '1px solid white' }}
                    title="Gehitu bildumara"
                >
                    +
                </Col>
            </Row>
        </Container>
    );
};

export default CardDetail;