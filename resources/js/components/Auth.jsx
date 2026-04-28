import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import axios from 'axios'; 
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

// Configuración base de Axios
axios.defaults.withCredentials = true;

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post('/login', { email, password });
            
            // Unificado a /api/user/profile
            const userRes = await axios.get('/api/user/profile');
            const userData = userRes.data.user || userRes.data;

            if (userData) {
                setUser(userData);
                localStorage.setItem('isLoggedIn', 'true');
                navigate("/perfila");
            }
        } catch (err) {
            console.error("Errorea:", err);
            if (err.response?.status === 419) {
                setError("Saioa iraungi da. Mesedez, kargatu berriro orria.");
                window.location.reload();
            } else {
                setError(err.response?.data?.message || "Kredentzialak ez dira zuzenak.");
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center pt-5 font-custom">
            <Card style={{ width: '400px', backgroundColor: '#111', color: 'white' }} className="shadow-lg p-4 border-0 rounded-4">
                <h3 className="text-center mb-4 fw-black italic text-uppercase text-white">
                    HASI <span className="text-warning">SAIOA</span>
                </h3>
                {error && <Alert variant="danger" className="py-2 small bg-danger text-white border-0">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="small fw-bold opacity-75">Posta elektronikoa</Form.Label>
                        <Form.Control 
                            className="bg-dark border-secondary text-white" 
                            type="email" 
                            required 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="adibidea@mail.com" 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="small fw-bold opacity-75">Pasahitza</Form.Label>
                        <Form.Control 
                            className="bg-dark border-secondary text-white" 
                            type="password" 
                            required 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="********" 
                        />
                    </Form.Group>
                    <Button variant="warning" type="submit" className="w-100 fw-black py-2 mt-2 text-uppercase shadow-sm">
                        Sartu
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "user" 
    });
    
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post('/register', formData);
            
            if (response.status === 201 || response.status === 200) {
                alert("Kontua sortua! Orain hasi saioa.");
                navigate("/login");
            }
        } catch (err) {
            console.error("Registro error:", err);
            if (err.response?.status === 419) {
                setError("Tokena iraungi da. Freskatu orrialdea.");
            } else if (err.response?.data?.errors) {
                const messages = Object.values(err.response.data.errors).flat();
                setError(messages[0]); 
            } else {
                setError(err.response?.data?.error || "Ezin izan da erabiltzailea sortu. Ziurtatu datuak ondo daudela.");
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center pt-5 font-custom">
            <Card style={{ width: '400px', backgroundColor: '#111', color: 'white' }} className="shadow-lg p-4 border-0 rounded-4">
                <h3 className="text-center mb-4 fw-black italic text-uppercase text-white">
                    ERRE<span className="text-success">GISTRATU</span>
                </h3>
                {error && <Alert variant="danger" className="py-2 small bg-danger text-white border-0">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="small fw-bold opacity-75">Izena</Form.Label>
                        <Form.Control 
                            name="name"
                            className="bg-dark border-secondary text-white"
                            type="text" 
                            required 
                            onChange={handleChange} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="small fw-bold opacity-75">Posta elektronikoa</Form.Label>
                        <Form.Control 
                            name="email"
                            className="bg-dark border-secondary text-white"
                            type="email" 
                            required 
                            onChange={handleChange} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="small fw-bold opacity-75">Pasahitza</Form.Label>
                        <Form.Control 
                            name="password"
                            className="bg-dark border-secondary text-white"
                            type="password" 
                            required 
                            onChange={handleChange} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-4 text-start">
                        <Form.Label className="small fw-bold opacity-75">Pasahitza errepikatu</Form.Label>
                        <Form.Control 
                            name="password_confirmation"
                            className="bg-dark border-secondary text-white"
                            type="password" 
                            required 
                            onChange={handleChange} 
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100 fw-black py-2 text-uppercase shadow-sm">
                        Kontua Sortu
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};