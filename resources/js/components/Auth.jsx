import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import axios from 'axios'; // Usaremos axios para manejar mejor las cookies

// Configuración base de Axios (puedes mover esto a un archivo central si quieres)
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000'; // Asegúrate de que es tu URL

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // 1. Limpiamos cualquier rastro anterior
            await axios.get('/sanctum/csrf-cookie');

            // 2. Login (asegúrate de que la URL es /login, no /api/login)
            const response = await axios.post('/login', { email, password });

            if (response.status === 200) {
                // 3. Forzamos una pequeña espera o comprobación
                const userRes = await axios.get('/api/user');
                console.log("Usuario verificado:", userRes.data);
                
                window.location.href = "/perfila"; 
            }
        } catch (err) {
            setError("Kredentzialak okerrak dira");
        }
    };

    return (
        <Container className="d-flex justify-content-center pt-5">
            <Card style={{ width: '400px' }} className="shadow p-4 border-0">
                <h3 className="text-center mb-4 fw-bold">Hasi saioa</h3>
                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="small fw-semibold">Posta elektronikoa</Form.Label>
                        <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} placeholder="adibidea@mail.com" />
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="small fw-semibold">Pasahitza</Form.Label>
                        <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} placeholder="********" />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 fw-bold py-2 mt-2">Sartu</Button>
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
        password_confirmation: ""
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // También pedimos cookie para registro si Laravel lo requiere
            await axios.get('/sanctum/csrf-cookie');
            
            const response = await axios.post('/register', formData);
            
            if (response.status === 201 || response.status === 200) {
                alert("Kontua sortua! Orain hasi saioa.");
                window.location.href = "/login";
            }
        } catch (err) {
            setError(err.response?.data?.message || "Ezin izan da erabiltzailea sortu.");
        }
    };

    return (
        <Container className="d-flex justify-content-center pt-5">
            <Card style={{ width: '400px' }} className="shadow p-4 border-0">
                <h3 className="text-center mb-4 fw-bold">Erregistratu</h3>
                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="small fw-semibold">Izena</Form.Label>
                        <Form.Control type="text" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="small fw-semibold">Posta elektronikoa</Form.Label>
                        <Form.Control type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="small fw-semibold">Pasahitza</Form.Label>
                        <Form.Control type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </Form.Group>
                    <Form.Group className="mb-3 text-start">
                        <Form.Label className="small fw-semibold">Pasahitza errepikatu</Form.Label>
                        <Form.Control type="password" required onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100 fw-bold py-2 mt-2">Kontua Sortu</Button>
                </Form>
            </Card>
        </Container>
    );
};