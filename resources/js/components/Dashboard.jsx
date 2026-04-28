import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

const Dashboard = () => {
    const [stats, setStats] = useState({ cards_count: 0, total_spent: 0, xp: 0 });
    const [showBanner, setShowBanner] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // 1. Cargar estadísticas del usuario
        axios.get('/api/user/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error("Errorea datuak kargatzean", err));

        // 2. Comprobar si venimos de confirmar el email
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('verified') === '1') {
            setShowBanner(true);
            setTimeout(() => setShowBanner(false), 6000);
        }
    }, [location]);

    return (
        <Container className="py-5 text-white">
            <style>{`
                .dashboard-title { font-weight: 900; letter-spacing: -1px; text-transform: uppercase; }
                .stat-card-amara { 
                    background: #111; 
                    border: 1px solid #222; 
                    border-radius: 20px; 
                    transition: 0.3s;
                }
                .stat-card-amara:hover { border-color: #facc15; transform: translateY(-5px); }
                .text-yellow { color: #facc15 !important; }
                .text-amara-muted { color: #aaaaaa !important; }
                
                /* Banner de verificación elegante */
                .alert-verified {
                    background: #1a1a1a;
                    border: 1px solid #28a745;
                    color: white;
                    border-radius: 15px;
                }
            `}</style>

            {/* --- SECCIÓN DE NOTIFICACIÓN --- */}
            {showBanner && (
                <Alert className="alert-verified shadow-lg mb-5 d-flex align-items-center">
                    <span className="fs-3 me-3">✅</span>
                    <div>
                        <h5 className="mb-0 fw-bold text-success text-uppercase fs-6">Posta elektronikoa berretsia!</h5>
                        <small className="text-amara-muted">Zure kontua erabat aktibatuta dago orain. Ongi etorri, entrenatzaile.</small>
                    </div>
                </Alert>
            )}

            <div className="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <h2 className="dashboard-title fs-1 mb-0">NIRE <span className="text-yellow">DASHBOARD-A</span></h2>
                    <p className="text-amara-muted mb-0 small">Zure jardueraren laburpen orokorra</p>
                </div>
                <span className="badge border border-secondary text-secondary px-3 py-2 text-uppercase fw-black italic" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
                    ENTRENATZAILEA
                </span>
            </div>

            <Row className="g-4">
                {/* Carta de XP */}
                <Col md={4}>
                    <Card className="stat-card-amara p-4 h-100 shadow-lg">
                        <Card.Body className="p-0">
                            <h6 className="text-yellow fw-bold text-uppercase small mb-3">Zure XP-a</h6>
                            <div className="d-flex align-items-baseline">
                                <span className="display-5 fw-black text-white">{stats.xp}</span>
                                <span className="ms-2 text-amara-muted fw-bold">XP</span>
                            </div>
                            <div className="mt-3 border-top border-dark pt-2">
                                <small className="text-amara-muted">Maila igotzeko falta zaizuna</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Carta de Cartas Compradas */}
                <Col md={4}>
                    <Card className="stat-card-amara p-4 h-100 shadow-lg">
                        <Card.Body className="p-0">
                            <h6 className="text-yellow fw-bold text-uppercase small mb-3">Bildutako Kartak</h6>
                            <div className="d-flex align-items-baseline">
                                <span className="display-5 fw-black text-white">{stats.cards_count}</span>
                                <span className="ms-2 text-amara-muted fw-bold">KARTA</span>
                            </div>
                            <div className="mt-3 border-top border-dark pt-2">
                                <small className="text-amara-muted text-truncate d-block">Zure bilduma pribatua</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Carta de Gasto Total */}
                <Col md={4}>
                    <Card className="stat-card-amara p-4 h-100 shadow-lg">
                        <Card.Body className="p-0">
                            <h6 className="text-yellow fw-bold text-uppercase small mb-3">Guztira Gastatua</h6>
                            <div className="d-flex align-items-baseline">
                                <span className="display-5 fw-black text-white">{stats.total_spent}</span>
                                <span className="ms-2 text-amara-muted fw-bold">€</span>
                            </div>
                            <div className="mt-3 border-top border-dark pt-2">
                                <small className="text-amara-muted">Inbertsio totala merkatuan</small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <hr className="my-5 border-secondary opacity-10" />
            
            <div className="text-center py-4">
                <p className="text-amara-muted small italic">Azken mugimenduak ikusteko, joan zure profilera.</p>
            </div>
        </Container>
    );
};

export default Dashboard;