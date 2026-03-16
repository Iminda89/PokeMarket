import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, Spinner, Button } from 'react-bootstrap';
import { useUser } from './UserContext'; // Para saber quién es el comprador
import axios from 'axios';

const Shop = () => {
    const { user } = useUser();
    const [listings, setListings] = useState([]);
    const [sets, setSets] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [filterName, setFilterName] = useState("");
    const [filterSet, setFilterSet] = useState("");

    // 1. Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [listingsRes, setsRes] = await Promise.all([
                    axios.get('/api/listings'),
                    axios.get('/api/sets')
                ]);
                setListings(listingsRes.data);
                setSets(setsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Errorea datuak kargatzean:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Función para comprar
    const handleBuy = async (listingId) => {
        if (!window.confirm("Ziur zaude karta hau erosi nahi duzula?")) return;

        try {
            const response = await axios.post(`/api/listings/${listingId}/buy`);
            
            // Mensaje de éxito
            alert(`${response.data.message} +${response.data.xp_gained} XP irabazi dituzu!`);
            
            // --- LA CLAVE ESTÁ AQUÍ ---
            // Actualizamos el estado local inmediatamente para que la carta se esfume de la tienda
            setListings(prevListings => prevListings.filter(item => item.id !== listingId));
            
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || "Errorea erosketan");
        }
    };

    // 3. Lógica de filtrado
    const filteredListings = listings.filter(item => {
        const matchesName = item.card.name.toLowerCase().includes(filterName.toLowerCase());
        const matchesSet = filterSet === "" || item.card.card_set?.name === filterSet;
        return matchesName && matchesSet;
    });

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Denda kargatzen... ⏳</p>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h2 className="mb-4 fw-bold">Karten Denda 🛒</h2>

            {/* BARRA DE BÚSQUEDA Y FILTRO */}
            <Row className="mb-5 p-3 bg-white shadow-sm rounded border g-3">
                <Col md={8}>
                    <Form.Label className="fw-bold small">Bilatu Karta</Form.Label>
                    <Form.Control 
                        placeholder="Pikachu, Charizard..." 
                        onChange={(e) => setFilterName(e.target.value)}
                    />
                </Col>
                <Col md={4}>
                    <Form.Label className="fw-bold small">Bilduma</Form.Label>
                    <Form.Select onChange={(e) => setFilterSet(e.target.value)}>
                        <option value="">Guztiak (Todas)</option>
                        {sets.map(s => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            <Row>
                {filteredListings.length > 0 ? (
                    filteredListings.map(item => {
                        // Comprobar si la carta es del usuario actual
                        const isMyCard = user && item.user_id === user.id;

                        return (
                            <Col key={item.id} xs={12} sm={6} lg={4} className="mb-4">
                                <Card className="h-100 shadow-sm border-0 overflow-hidden card-hover">
                                    <div className="p-3 bg-light text-center position-relative">
                                        <Badge bg="dark" className="position-absolute" style={{top: '10px', left: '10px'}}>
                                            {item.card.card_set?.name}
                                        </Badge>
                                        <Card.Img 
                                            variant="top" 
                                            src={item.card.image_url} 
                                            style={{ height: '220px', objectFit: 'contain' }}
                                        />
                                    </div>

                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="fw-bold mb-1">{item.card.name}</Card.Title>
                                        <div className="text-muted small mb-3">
                                            <div><strong>Rarity:</strong> {item.card.rarity}</div>
                                            <div className="text-primary mt-1">
                                                <strong>Saltzailea:</strong> @{item.user.name} 
                                                {isMyCard && <span className="ms-1 text-muted">(Zu)</span>}
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between align-items-center border-top pt-2 mb-3">
                                                <h4 className="text-success fw-bold mb-0">{item.price}€</h4>
                                                <Badge bg={item.psa_grade ? "warning" : "secondary"} text="dark">
                                                    {item.psa_grade ? `PSA ${item.psa_grade}` : 'Raw'}
                                                </Badge>
                                            </div>

                                            <Button 
                                                variant={isMyCard ? "outline-secondary" : "primary"} 
                                                className="w-100 rounded-pill fw-bold"
                                                onClick={() => handleBuy(item.id)}
                                                disabled={isMyCard} // No puedes comprar tu propia carta
                                            >
                                                {isMyCard ? "Zure karta da" : "Erosi 🛒"}
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })
                ) : (
                    <Col className="text-center py-5">
                        <h4 className="text-muted">Ez da emaitzarik aurkitu 🔍</h4>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default Shop;