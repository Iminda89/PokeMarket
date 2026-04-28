import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

const AdminSets = () => {
    const [sets, setSets] = useState([]);
    const [newSet, setNewSet] = useState({ name: '', description: '' });
    const [newCard, setNewCard] = useState({ 
        card_set_id: '', 
        name: '', 
        number: '', 
        type: '', 
        rarity: '', 
        price: '', 
        image_url: '' 
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSets();
    }, []);

    const fetchSets = async () => {
        try {
            const response = await axios.get('/api/admin/sets');
            setSets(response.data);
        } catch (err) {
            console.error("Errorea bildumak kargatzean:", err);
        }
    };

    const handleCreateSet = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await axios.post('/api/admin/sets', newSet);
            setMessage(response.data.message);
            setNewSet({ name: '', description: '' });
            fetchSets();
        } catch (err) {
            setError(err.response?.data?.message || 'Ezin izan da bilduma sortu.');
        }
    };

    const handleCreateCard = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await axios.post('/api/admin/cards', newCard);
            setMessage(response.data.message);
            // Reemplazamos el estado para que no queden campos como undefined
            setNewCard({ 
                card_set_id: '', 
                name: '', 
                number: '', 
                type: '', 
                rarity: '', 
                price: '', 
                image_url: '' 
            });
            fetchSets();
        } catch (err) {
            setError(err.response?.data?.message || 'Ezin izan da karta sortu.');
        }
    };

    const toggleSetStatus = async (id) => {
        try {
            const response = await axios.patch(`/api/admin/sets/${id}/toggle`);
            setMessage(response.data.message);
            fetchSets();
        } catch (err) {
            setError('Ezin izan da egoera aldatu.');
        }
    };

    return (
        <Container className="py-5 text-white">
            <h2 className="fw-black mb-4">BILDUMAK ETA KARTAK KUDEATU</h2>
            {message && <Alert variant="success" className="bg-success text-white border-0">{message}</Alert>}
            {error && <Alert variant="danger" className="bg-danger text-white border-0">{error}</Alert>}

            <Row className="g-4 mt-2">
                {/* Formulario Crear Set */}
                <Col md={6}>
                    <Card className="bg-dark border border-secondary p-4 h-100 rounded-4">
                        <h4 className="text-warning fw-bold mb-3">Sortu Bilduma Berria</h4>
                        <Form onSubmit={handleCreateSet}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Izena</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    className="bg-dark border-secondary text-white"
                                    value={newSet.name || ''} 
                                    onChange={(e) => setNewSet({...newSet, name: e.target.value})} 
                                    required 
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold">Deskribapena</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3}
                                    className="bg-dark border-secondary text-white" 
                                    value={newSet.description || ''} 
                                    onChange={(e) => setNewSet({...newSet, description: e.target.value})} 
                                />
                            </Form.Group>
                            <Button type="submit" variant="warning" className="w-100 fw-bold text-dark">
                                Sortu Bilduma
                            </Button>
                        </Form>
                    </Card>
                </Col>

                {/* Formulario Crear Karta */}
                <Col md={6}>
                    <Card className="bg-dark border border-secondary p-4 h-100 rounded-4">
                        <h4 className="text-success fw-bold mb-3">Gehitu Karta Berria</h4>
                        <Form onSubmit={handleCreateCard}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Aukeratu Bilduma</Form.Label>
                                <Form.Select 
                                    className="bg-dark border-secondary text-white"
                                    value={newCard.card_set_id || ''} 
                                    onChange={(e) => setNewCard({...newCard, card_set_id: e.target.value})} 
                                    required
                                >
                                    <option value="">Aukeratu...</option>
                                    {sets.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Karta Izena</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    className="bg-dark border-secondary text-white"
                                    value={newCard.name || ''} 
                                    onChange={(e) => setNewCard({...newCard, name: e.target.value})} 
                                    required 
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Karta Zenbakia (Number)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    className="bg-dark border-secondary text-white"
                                    value={newCard.number || ''} 
                                    onChange={(e) => setNewCard({...newCard, number: e.target.value})} 
                                    placeholder="151/165"
                                    required 
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Mota (Type)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    className="bg-dark border-secondary text-white"
                                    value={newCard.type || ''} 
                                    onChange={(e) => setNewCard({...newCard, type: e.target.value})} 
                                    placeholder="Fire, Water..."
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Arrandi/Rarity</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    className="bg-dark border-secondary text-white"
                                    value={newCard.rarity || ''} 
                                    onChange={(e) => setNewCard({...newCard, rarity: e.target.value})} 
                                    placeholder="Common, Rare, Ultra Rare..."
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Prezioa (€)</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    step="0.01"
                                    className="bg-dark border-secondary text-white" 
                                    value={newCard.price || ''} 
                                    onChange={(e) => setNewCard({...newCard, price: e.target.value})} 
                                    required 
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold">Irudiaren URLa</Form.Label>
                                <Form.Control 
                                    type="text"
                                    className="bg-dark border-secondary text-white" 
                                    value={newCard.image_url || ''} 
                                    onChange={(e) => setNewCard({...newCard, image_url: e.target.value})} 
                                    placeholder="https://..."
                                />
                            </Form.Group>
                            
                            <Button type="submit" variant="success" className="w-100 fw-bold">
                                Gehitu Karta
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>

            {/* Listado de Sets actuales */}
            <Row className="mt-5">
                <Col>
                    <h4 className="fw-bold mb-3">Dauden Bildumak</h4>
                    <div className="table-responsive">
                        <Table striped bordered hover variant="dark" className="align-middle">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Izena</th>
                                    <th>Karta Kopurua</th>
                                    <th>Egoera</th>
                                    <th>Ekintzak</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sets.map((s, idx) => (
                                    <tr key={s.id}>
                                        <td>{idx + 1}</td>
                                        <td>{s.name}</td>
                                        <td>{s.cards_count || 0}</td>
                                        <td>
                                            <span className={s.is_active ? 'text-success' : 'text-danger'}>
                                                {s.is_active ? 'Aktiboa' : 'Ezkutatuta'}
                                            </span>
                                        </td>
                                        <td>
                                            <Button 
                                                variant={s.is_active ? 'outline-danger' : 'outline-success'} 
                                                size="sm" 
                                                onClick={() => toggleSetStatus(s.id)}
                                            >
                                                {s.is_active ? <FaTimes /> : <FaCheck />} {s.is_active ? 'Ezkutatu' : 'Erakutsi'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminSets;