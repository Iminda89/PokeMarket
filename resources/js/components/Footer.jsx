import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => (
    <footer className="bg-dark text-white py-4 mt-auto">
        <Container>
            <Row className="align-items-center">
                <Col md={6} className="text-center text-md-start">
                    <h5>PokeMarket 🃏</h5>
                    <p className="small mb-0">Zure karten denda fidagarria.</p>
                </Col>
                <Col md={6} className="text-center text-md-end">
                    <div className="fs-4">
                        <a href="#" className="text-white me-3"><FaTwitter /></a>
                        <a href="#" className="text-white me-3"><FaInstagram /></a>
                        <a href="#" className="text-white"><FaFacebook /></a>
                    </div>
                </Col>
            </Row>
            <hr />
            <div className="text-center small">© 2026 PokeMarket</div>
        </Container>
    </footer>
);

export default Footer;