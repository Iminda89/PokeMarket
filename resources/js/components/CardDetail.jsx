import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Spinner, Button, Card, Badge } from 'react-bootstrap';
import { useUser } from './UserContext';

const CardDetail = () => {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();

    const [card, setCard] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        axios.get(`/api/cards/${id}`)
            .then(res => {
                if (isMounted) setCard(res.data);
            })
            .catch(err => {
                console.error("Errorea karga prozesuan:", err);
                if (isMounted) setError(true);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, [id]);

    const handleCollection = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setIsAdding(true);
        try {
            await axios.get('/sanctum/csrf-cookie');
            const res = await axios.post(`/api/cards/${id}/collection`);
            alert(res.data.message || "Karta bildumara gehitu da!");
        } catch (err) {
            if (err.response?.status === 401) {
                alert("Saioa iraungi da. Hasi saioa berriro.");
                navigate('/login');
            } else {
                alert("Errorea gertatu da karta gehitzean.");
            }
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) return (
        <Container className="py-5 text-center vh-100 d-flex flex-column justify-content-center align-items-center text-white">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3 fw-bold text-uppercase">Datuak kargatzen...</p>
        </Container>
    );

    if (error || !card) return (
        <Container className="py-5 text-center text-white">
            <h3 className="fw-black text-uppercase">Karta ez da aurkitu</h3>
            <Button onClick={() => navigate(-1)} className="btn-yellow-amara mt-3">ATZERA JOAN</Button>
        </Container>
    );

    const cardNumber = card.number?.includes('/') ? card.number.split('/')[0] : (card.number || id);

    return (
        <Container className="py-5 text-white">
            <style>{`
                .detail-card-amara { background: #111; border: 1px solid #222; border-radius: 30px; overflow: hidden; }
                .img-detail-container { background: #1a1a1a; padding: 40px; display: flex; align-items: center; justify-content: center; border-right: 1px solid #222; }
                .text-yellow { color: #facc15 !important; }
                .text-amara-muted { color: #aaaaaa !important; }
                .graph-box { background: #000; border: 1px solid #222; border-radius: 20px; }
                .psa-price-card { background: #1a1a1a; border: 1px solid #333; border-radius: 15px; transition: 0.3s; }
                .psa-price-card:hover { border-color: #facc15; }
                .btn-outline-amara { border: 2px solid #333; color: white; font-weight: 800; border-radius: 12px; transition: 0.3s; }
                .btn-outline-amara:hover { border-color: #facc15; color: #facc15; }
            `}</style>

            <Card className="detail-card-amara shadow-lg border-0">
                <Row className="g-0">
                    {/* Columna Imagen */}
                    <Col md={5} className="img-detail-container">
                        <img 
                            src={card.image_url || '/placeholder-card.png'} 
                            alt={card.name} 
                            className="img-fluid rounded shadow-lg"
                            style={{ 
                                maxHeight: '550px', 
                                filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.8))' 
                            }} 
                        />
                    </Col>

                    {/* Columna Información */}
                    <Col md={7} className="p-4 p-lg-5 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <Badge bg="dark" className="border border-secondary px-3 py-2 text-yellow">
                                #{cardNumber}
                            </Badge>
                            <span className="text-amara-muted small fw-black text-uppercase italic">
                                {card.rarity || 'Common'}
                            </span>
                        </div>
                        
                        <h1 className="display-4 fw-black text-white text-uppercase mb-1">
                            {card.name}
                        </h1>
                        <p className="text-yellow fs-5 fw-bold mb-4 italic">
                            {card.card_set?.name || 'Bilduma Ezezaguna'}
                        </p>

                        {/* Gráfico de valor */}
                        <div className="graph-box p-4 mb-5 shadow-inner">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="small text-amara-muted fw-bold text-uppercase letter-spacing-1">Balioaren Estimazioa</span>
                                <Badge bg="success" className="px-2 py-1">+12.4%</Badge>
                            </div>
                            <svg viewBox="0 0 500 100" className="w-100" style={{ height: '80px', filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))' }}>
                                <path 
                                    d="M0,80 Q50,20 100,70 T200,40 T300,60 T400,20 T500,50" 
                                    fill="none" 
                                    stroke="#3b82f6" 
                                    strokeWidth="4" 
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        {/* Acciones */}
                        <div className="d-flex gap-3 mb-5">
                            <Button 
                                onClick={handleCollection} 
                                disabled={isAdding}
                                className="btn-yellow-amara flex-grow-1 py-3"
                            >
                                {isAdding ? <Spinner size="sm" /> : '+ BILDUMARA'}
                            </Button>
                        </div>

                        {/* Precios PSA */}
                        <h6 className="fw-black text-white text-uppercase mb-3 small letter-spacing-2">PSA Merkatu Prezioak</h6>
                        <Row className="g-3">
                            {card.psa_prices?.length > 0 ? (
                                card.psa_prices.map((item, index) => (
                                    <Col key={index} xs={6} sm={4}>
                                        <div className="psa-price-card p-3 text-center">
                                            <div className="text-yellow fw-black fs-6 italic">PSA {item.grade}</div>
                                            <div className="fs-4 fw-black text-white">${item.price}</div>
                                        </div>
                                    </Col>
                                ))
                            ) : (
                                <Col className="text-amara-muted small italic">Ez dago prezio daturik eskuragarri une honetan.</Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default CardDetail;