import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button, NavDropdown, Image } from 'react-bootstrap';
import ContactForm from './ContactForm';
import Footer from './Footer';
import { LoginForm, RegisterForm } from './Auth';
import Home from './Home';
import Shop from './Shop';
import Collections from './Collections';
import Profile from './Profile'; 
import { UserProvider, useUser } from "./UserContext";
import SetDetail from './SetDetail'; 
import CardDetail from './CardDetail';
import { Navigate } from 'react-router-dom'; // Añade Navigate a tus imports
import axios from 'axios';

axios.defaults.withCredentials = true;
// Si usas el mismo puerto para ambos, quita el 'http://localhost:8000'
// para que use rutas relativas.
axios.defaults.baseURL = '/'; 
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

function AppContent() {
    const { user, loading } = useUser();

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar bg="dark" variant="dark" expand="lg" className="px-4 shadow">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">PokeMarket 🃏</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Hasiera</Nav.Link>
                            <Nav.Link as={Link} to="/denda">Denda</Nav.Link>
                            <Nav.Link as={Link} to="/bildumak">Bildumak</Nav.Link>
                            <Nav.Link as={Link} to="/kontaktua">Kontaktua</Nav.Link>
                        </Nav>
                        <Nav className="gap-2 align-items-center">
                            {loading ? (
                                <span className="text-light small">Kargatzen...</span>
                            ) : user ? (
                                <NavDropdown 
                                    title={
                                        <div className="d-flex align-items-center gap-2">
                                            <Image 
                                                src={user.avatar_url || '/default-avatar.png'} 
                                                roundedCircle 
                                                style={{ width: '35px', height: '35px', objectFit: 'cover', border: '2px solid white' }}
                                            />
                                            <span className="text-light">{user.name}</span>
                                        </div>
                                    } 
                                    id="user-nav-dropdown" 
                                    align="end"
                                >
                                    <NavDropdown.Item as={Link} to="/perfila">Nire Kontua</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={async () => {
                                        try {
                                            await axios.post('/logout'); // Axios ya sabe qué hacer
                                            window.location.href = "/";
                                        } catch (err) {
                                            // Si falla el POST (por CSRF), forzamos salida
                                            window.location.href = "/";
                                        }
                                    }} className="text-danger">
                                        Saioa itxi
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <>
                                    <Button as={Link} to="/login" variant="outline-light" size="sm">Hasi saioa</Button>
                                    <Button as={Link} to="/register" variant="primary" size="sm">Erregistratu</Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <main className="flex-grow-1 py-5">
                <Container>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/denda" element={<Shop />} />
                        
                        {/* PROTECCIÓN: Si ya hay user, el Login y Register te mandan a /perfila */}
                        <Route path="/login" element={user ? <Navigate to="/perfila" /> : <LoginForm />} />
                        <Route path="/register" element={user ? <Navigate to="/perfila" /> : <RegisterForm />} />
                        
                        <Route path="/bildumak" element={<Collections />} />
                        <Route path="/kontaktua" element={<ContactForm />} />
                        
                        {/* PROTECCIÓN: Si no hay user, el Perfil te manda al Login */}
                        <Route path="/perfila" element={user ? <Profile /> : <Navigate to="/login" />} />
                        
                        <Route path="/bildumak/:id" element={<SetDetail />} />
                        {/* Asegúrate de que aquí la ruta coincida con la que usas en el Link de Sets (karta o card) */}
                        <Route path="/karta/:id" element={<CardDetail />} />
                    </Routes>
                </Container>
            </main>
            <Footer />
        </div>
    );
}

// 2. EL COMPONENTE PRINCIPAL SOLO ENVUELVE
function App() {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}

export default App;