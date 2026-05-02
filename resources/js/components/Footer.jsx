import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => (
    <footer className="bg-pm-dark py-5 mt-auto border-top border-dark">
        <style>{`
            .footer-title { 
                font-weight: 900; 
                letter-spacing: -0.5px; 
                color: #ffffff;
            }
            .footer-text { 
                color: #888888; /* Gris suave legible estilo Amara */
                font-weight: 400;
                letter-spacing: 0.5px;
            }
            .footer-social-link {
                color: #ffffff;
                opacity: 0.6;
                transition: all 0.3s ease;
                font-size: 1.4rem;
            }
            .footer-social-link:hover {
                color: #facc15; /* Amarillo Amara al pasar el ratón */
                opacity: 1;
                transform: translateY(-2px);
            }
            .footer-bottom-text {
                color: #444444;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
                font-size: 0.7rem;
            }
        `}</style>
        
        <Container>
            <Row className="align-items-center gy-4">
                {/* IZQUIERDA: Marca y Slogan */}
                <Col md={6} className="text-center text-md-start">
                    <h5 className="footer-title mb-2">
                        POKEMARKET <span className="fw-light opacity-50">amara</span>
                    </h5>
                    <p className="footer-text small mb-0">
                        Zure karten denda fidagarria eta profesionala.
                    </p>
                </Col>

                {/* DERECHA: Redes Sociales */}
                <Col md={6} className="text-center text-md-end">
                    <div className="d-flex justify-content-center justify-content-md-end gap-4">
                        <a href="#" className="footer-social-link"><FaTwitter /></a>
                        <a href="#" className="footer-social-link"><FaInstagram /></a>
                        <a href="#" className="footer-social-link"><FaFacebook /></a>
                    </div>
                </Col>
            </Row>

            {/* Separador sutil */}
            <hr className="my-4 border-secondary opacity-10" />

            {/* COPYRIGHT estilo Amara */}
            <div className="text-center footer-bottom-text">
                © 2026 POKEMARKET — MEMBER AREA V2.0
            </div>
        </Container>
    </footer>
);

export default Footer;