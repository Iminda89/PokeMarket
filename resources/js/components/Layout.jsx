import { Container, Row, Col, Nav } from 'react-bootstrap';
import { FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

export const Footer = () => (
    <footer className="bg-dark text-white pt-4 pb-2 mt-5">
        <Container>
            <Row className="text-center text-md-start">
                <Col md={6}>
                    <h5>PokeMarket</h5>
                    <p>Zure Pokémon karten denda fidagarria.</p>
                </Col>
                <Col md={6} className="text-center text-md-end">
                    <h5>Jarraitu guri</h5>
                    <Nav className="justify-content-center justify-content-md-end">
                        <Nav.Link href="#" className="text-white"><FaTwitter size={24} /></Nav.Link>
                        <Nav.Link href="#" className="text-white"><FaInstagram size={24} /></Nav.Link>
                        <Nav.Link href="#" className="text-white"><FaGithub size={24} /></Nav.Link>
                    </Nav>
                </Col>
            </Row>
            <hr />
            <p className="text-center small">© 2024 PokeMarket</p>
        </Container>
    </footer>
);