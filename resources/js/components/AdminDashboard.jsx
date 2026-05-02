import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUsers, FaLayerGroup, FaEnvelope, FaEye, FaArrowRight } from 'react-icons/fa';

const AdminDashboard = () => {
    // Solo las secciones que necesitas ahora
    const adminSections = [
        {
            title: "ERABILTZAILEAK",
            desc: "Ikusi nor dagoen harpidetuta, aldatu rolak edo kudeatu kideen datuak modu seguruan.",
            icon: <FaUsers />,
            path: "/admin/users",
            btnText: "ZERRENDA IKUSI"
        },
        {
            title: "BILDUMAK (SETS)",
            desc: "Kudeatu karten bildumak, aktibatu berriak edo ezkutatu denda publikotik klik batekin.",
            icon: <FaLayerGroup />,
            path: "/admin/sets",
            btnText: "EDUKIA KUDEATU"
        },
        {
            title: "MEZUAK",
            desc: "Kudeatu erabiltzaileen galderak, intzidentziak eta eman arreta zuzena hemendik.",
            icon: <FaEnvelope />,
            path: "/admin/messages",
            btnText: "SARTU TXAT-ERA"
        }
    ];

    return (
        <Container className="py-5">
            <style>{`
                /* Fondos y Contenedores */
                .admin-hub-card { 
                    background: #111; 
                    border: 1px solid #333; 
                    border-radius: 24px; 
                    transition: all 0.3s ease;
                    height: 100%;
                }
                .admin-hub-card:hover { 
                    border-color: #facc15; 
                    transform: translateY(-8px);
                    box-shadow: 0 15px 40px rgba(0,0,0,0.6);
                }

                /* Iconos */
                .icon-box {
                    background: #1a1a1a;
                    width: 55px;
                    height: 55px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 14px;
                    color: #facc15;
                    font-size: 1.6rem;
                    border: 1px solid #333;
                    margin-bottom: 25px;
                }

                /* Tipografía mejorada para legibilidad */
                .text-amara-bright { color: #ffffff !important; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; }
                .text-amara-muted { color: #cccccc !important; font-size: 0.95rem; line-height: 1.6; }
                .text-yellow { color: #facc15 !important; }

                /* Botones de Navegación */
                .btn-admin-nav {
                    background: #222;
                    color: #ffffff;
                    border: 1px solid #444;
                    border-radius: 14px;
                    padding: 12px;
                    font-weight: 800;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    width: 100%;
                    transition: 0.3s;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .btn-admin-nav:hover {
                    background: #facc15;
                    color: #000;
                    border-color: #facc15;
                }

                /* Stats Superiores */
                .stat-pill {
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 16px;
                    padding: 12px 25px;
                    text-align: center;
                    min-width: 140px;
                }
                .stat-label { color: #999; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
                .stat-value { color: #fff; font-size: 1.5rem; font-weight: 900; line-height: 1; }
            `}</style>

            {/* HEADER CABECERA */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-4">
                <div>
                    <div className="d-flex align-items-center gap-3 mb-2">
                        <Badge bg="warning" className="text-dark fw-black px-3 py-2" style={{ borderRadius: '8px', fontSize: '0.7rem' }}>
                            ADMIN MODE
                        </Badge>
                        <h1 className="text-amara-bright mb-0 fs-1 italic">
                            ADMIN <span className="text-yellow">CONTROL PANELA</span>
                        </h1>
                    </div>
                    <p className="text-amara-muted mb-0 italic fw-medium">Kudeatu gaurko erreserbak, erabiltzaileak eta harpidetzak modu zentralizatuan.</p>
                </div>

                <div className="d-flex gap-3 align-items-center">
                    <Link to="/" className="btn-admin-nav px-4 bg-dark border-secondary">
                        <FaEye /> IKUSI DENDA
                    </Link>
                    <div className="stat-pill">
                        <div className="stat-label">ERABILTZAILEAK</div>
                        <div className="stat-value">5</div>
                    </div>
                </div>
            </div>

            {/* GRID DE TARJETAS */}
            <Row className="g-4 justify-content-center">
                {adminSections.map((section, idx) => (
                    <Col key={idx} md={6} lg={4}>
                        <Card className="admin-hub-card p-4 shadow-lg">
                            <div className="icon-box">
                                {section.icon}
                            </div>
                            <h4 className="text-amara-bright mb-3 italic fs-5">
                                {section.title}
                            </h4>
                            <p className="text-amara-muted mb-5">
                                {section.desc}
                            </p>
                            <Link to={section.path} className="btn-admin-nav mt-auto">
                                {section.btnText} <FaArrowRight size={12} />
                            </Link>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* NOTA DE PIE */}
            <div className="text-center mt-5 pt-4">
                <p className="text-amara-muted small opacity-50 italic">Amara Trading Card Game - Administrazio Sistema v2.0</p>
            </div>
        </Container>
    );
};

export default AdminDashboard;