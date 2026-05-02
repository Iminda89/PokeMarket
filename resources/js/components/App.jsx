import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Offcanvas } from 'react-bootstrap';
import axios from 'axios';

// Componentes
import ContactForm from './ContactForm';
import Footer from './Footer';
import { LoginForm, RegisterForm } from './Auth';
import Home from './Home';
import Shop from './Shop';
import Collections from './Collections';
import Profile from './Profile'; 
import SetDetail from './SetDetail'; 
import CardDetail from './CardDetail';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminSets from './AdminSets';
import AdminMessages from './AdminMessages';

// Contexto
import { UserProvider, useUser } from "./UserContext";

function AppContent() {
    const { user, setUser, loading, logout } = useUser();
    const location = useLocation();
    
    // Estado para el menú lateral móvil (Hamburguesa)
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const handleCloseOffcanvas = () => setShowOffcanvas(false);
    const handleShowOffcanvas = () => setShowOffcanvas(true);

    if (loading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center bg-pm-dark text-white">
                <span>Kargatzen...</span>
            </div>
        );
    }

    const isAuthenticated = user && user.id;
    
    // Comprobamos si el usuario es administrador (por el rol o por el campo is_admin)
    const isAdmin = isAuthenticated && (
        user.role === 'admin' || 
        user.is_admin === 1 || 
        user.is_admin === true || 
        user.email === 'admin@admin.com'
    );

    // Helper para marcar el enlace activo (blanco puro si activo, gris suave si no)
    const getActiveClass = (path) => location.pathname === path ? 'text-white' : 'text-secondary';

    return (
        <div className="d-flex flex-column min-vh-100 bg-pm-dark text-white font-custom">
            
            {/* --- NAVBAR ESTILO AMARA --- */}
            <Navbar expand="lg" variant="dark" className="px-lg-5 py-4 border-bottom border-dark sticky-top bg-pm-dark">
                <Container fluid>
                    
                    {/* IZQUIERDA: Logo y NavLinks (Escritorio) */}
                    <div className="d-flex align-items-center gap-5">
                        <Navbar.Brand as={Link} to="/" className="fw-black fs-3 logo-text text-yellow">
                            POKEMARKET <span className="text-white fw-light">amara</span>
                        </Navbar.Brand>
                        
                        <Nav className="d-none d-lg-flex gap-4 fs-7 text-uppercase fw-bold letter-spacing-1">
                            <Nav.Link as={Link} to="/denda" className={`nav-link-amara p-0 ${getActiveClass('/denda')}`}>DENDA</Nav.Link>
                            <Nav.Link as={Link} to="/bildumak" className={`nav-link-amara p-0 ${getActiveClass('/bildumak')}`}>BILDUMAK</Nav.Link>
                            <Nav.Link as={Link} to="/kontaktua" className={`nav-link-amara p-0 ${getActiveClass('/kontaktua')}`}>KONTAKTUA</Nav.Link>
                        </Nav>
                    </div>

                    {/* DERECHA: Perfil / Admin / Hamburguesa */}
                    <div className="d-flex align-items-center gap-3">
                        
                        {isAuthenticated ? (
                            <div className="d-none d-lg-flex align-items-center gap-3">
                                {isAdmin && (
                                    <Link to="/admin" className="btn-admin-pill text-decoration-none">
                                        ADMIN PANELA
                                    </Link>
                                )}
                                
                                <Link to="/perfila" className="nav-link-amara text-yellow italic fw-black text-decoration-none border border-secondary border-opacity-25 px-3 py-1 rounded-pill">
                                    PERFILA: {user?.name?.toUpperCase()}
                                </Link>
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm" 
                                    onClick={logout}
                                    className="text-white border-0"
                                >
                                    Irten
                                </Button>
                            </div>
                        ) : (
                            // Call to action de registro añadido sin romper nada
                            <div className="d-none d-lg-flex align-items-center gap-3">
                                <Link to="/login" className="text-white text-decoration-none px-2">HASI SAIOA</Link>
                                <Link to="/register" className="btn-yellow-amara text-decoration-none px-3 py-2 rounded-pill fw-bold">
                                    ERREGISTRATU
                                </Link>
                            </div>
                        )}

                        {/* Hamburguesa Móvil */}
                        <Navbar.Toggle 
                            aria-controls="offcanvasNavbar" 
                            onClick={handleShowOffcanvas} 
                            className="border-0 shadow-none custom-toggler"
                        />
                    </div>
                </Container>
            </Navbar>

            {/* --- MENÚ LATERAL (OFFCANVAS) --- */}
            <Offcanvas 
                show={showOffcanvas} 
                onHide={handleCloseOffcanvas} 
                placement="end" 
                className="bg-pm-dark text-white border-start border-dark"
            >
                <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-dark">
                    <Offcanvas.Title className="fw-black text-yellow">POKEMARKET</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="d-flex flex-column h-100">
                    
                    <Nav className="flex-column gap-4 fs-2 fw-black text-uppercase mb-auto">
                        <Nav.Link as={Link} to="/denda" onClick={handleCloseOffcanvas} className="text-white p-0">DENDA</Nav.Link>
                        <Nav.Link as={Link} to="/bildumak" onClick={handleCloseOffcanvas} className="text-white p-0">BILDUMAK</Nav.Link>
                        <Nav.Link as={Link} to="/kontaktua" onClick={handleCloseOffcanvas} className="text-white p-0">KONTAKTUA</Nav.Link>
                    </Nav>
                    
                    <div className="d-flex flex-column gap-3 pt-4 border-top border-dark">
                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <Link 
                                        to="/admin" 
                                        onClick={handleCloseOffcanvas}
                                        className="btn-admin-pill-mobile text-center py-3 fw-bold text-decoration-none"
                                    >
                                        ADMIN PANELA
                                    </Link>
                                )}
                                <Link 
                                    to="/perfila" 
                                    onClick={handleCloseOffcanvas}
                                    className="btn-profile-mobile text-center py-3 fw-black italic text-yellow text-decoration-none border border-secondary border-opacity-25 rounded"
                                >
                                    PERFILA ({user?.name?.toUpperCase()})
                                </Link>
                                <Button 
                                    variant="danger" 
                                    onClick={() => {
                                        logout();
                                        handleCloseOffcanvas();
                                    }} 
                                    className="w-100 py-2 mt-2 fw-bold"
                                >
                                    Irten
                                </Button>
                            </>
                        ) : (
                            // Enlaces en el menú móvil (Offcanvas)
                            <div className="d-flex flex-column gap-3">
                                <Link 
                                    to="/login" 
                                    onClick={handleCloseOffcanvas} 
                                    className="btn btn-outline-light text-white w-100 py-3 text-center text-decoration-none"
                                >
                                    HASI SAIOA
                                </Link>
                                <Link 
                                    to="/register" 
                                    onClick={handleCloseOffcanvas} 
                                    className="btn-yellow-amara text-center w-100 py-3 fw-bold text-decoration-none rounded"
                                >
                                    ERREGISTRATU
                                </Link>
                            </div>
                        )}
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* --- CONTENIDO --- */}
            <main className="flex-grow-1 py-5">
                <Container>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/denda" element={<Shop />} />
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/perfila" /> : <LoginForm />} />
                        <Route path="/register" element={isAuthenticated ? <Navigate to="/perfila" /> : <RegisterForm />} />
                        <Route path="/bildumak" element={<Collections />} />
                        <Route path="/kontaktua" element={<ContactForm />} />
                        <Route path="/perfila" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                        <Route path="/bildumak/:id" element={<SetDetail />} />
                        <Route path="/karta/:id" element={<CardDetail />} />
                        
                        {/* Rutas de administración protegidas */}
                        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
                        <Route path="/admin/users" element={isAdmin ? <AdminUsers /> : <Navigate to="/" />} />
                        <Route path="/admin/sets" element={isAdmin ? <AdminSets /> : <Navigate to="/" />} />
                        <Route path="/admin/messages" element={isAdmin ? <AdminMessages /> : <Navigate to="/" />} />

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Container>
            </main>

            <Footer />
        </div>
    );
}

function App() {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}

export default App;