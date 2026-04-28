import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, Spinner, Button } from 'react-bootstrap';
import { useUser } from './UserContext'; 
import axios from 'axios';

const Shop = () => {
    const { user, setUser } = useUser(); 
    const [listings, setListings] = useState([]);
    const [sets, setSets] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [filterName, setFilterName] = useState("");
    const [filterSet, setFilterSet] = useState("");

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

    const handleBuy = async (listingId) => {
        if (!window.confirm("Ziur zaude karta hau erosi nahi duzula?")) return;

        try {
            const response = await axios.post(`/api/listings/${listingId}/buy`);
            alert(`${response.data.message} +${response.data.xp_gained} XP irabazi dituzu!`);
            setUser(response.data.user); 
            setListings(prevListings => prevListings.filter(item => item.id !== listingId));
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || "Errorea erosketan");
        }
    };

    const filteredListings = listings.filter(item => {
        const matchesName = item.card.name.toLowerCase().includes(filterName.toLowerCase());
        const matchesSet = filterSet === "" || item.card.card_set?.name === filterSet;
        return matchesName && matchesSet;
    });

    if (loading) {
        return (
            <Container className="text-center py-5 text-white">
                <Spinner animation="border" variant="warning" />
                <p className="mt-2 text-uppercase fw-bold">Denda kargatzen... ⏳</p>
            </Container>
        );
    }

    return (
        <Container className="py-4 font-custom text-white">
            <style>{`
                .shop-card { background: #111; border: 1px solid #222; border-radius: 20px; overflow: hidden; transition: 0.3s; }
                .shop-card:hover { border-color: #3b82f6; transform: translateY(-5px); }
                
                /* Inputs con texto blanco legible */
                .form-control-amara { background: #1a1a1a !important; border: 1px solid #333 !important; color: #ffffff !important; font-weight: 500; }
                .form-control-amara:focus { border-color: #facc15 !important; box-shadow: 0 0 0 0.25 border-color: rgba(250, 204, 21, 0.25); }
                .form-control-amara::placeholder { color: #777 !important; }

                .image-container-dark { background: #1a1a1a; border-radius: 15px; margin: 10px; padding: 20px; border: 1px solid #222; display: flex; justify-content: center; align-items: center; min-height: 250px; }
                
                .btn-buy-amara { background: #3b82f6 !important; border: none; border-radius: 12px; font-weight: 800; padding: 12px; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px; color: #ffffff !important; }
                .btn-buy-amara:hover { background: #2563eb !important; transform: scale(1.02); box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
                
                .psa-badge { background: #facc15 !important; color: #000000 !important; font-weight: 900; border-radius: 8px; padding: 6px 12px; }
                .raw-badge { background: #333 !important; color: #ffffff !important; font-weight: 700; border-radius: 8px; padding: 6px 12px; border: 1px solid #444; }
                
                /* Colores de texto optimizados */
                .text-yellow { color: #facc15 !important; }
                .text-light-gray { color: #cccccc !important; }
                .text-price { color: #2ecc71 !important; font-weight: 900; font-size: 1.6rem; text-shadow: 0 0 10px rgba(46, 204, 113, 0.2); }
                .seller-link { color: #3b82f6 !important; font-weight: 700; text-decoration: none; }
                .seller-link:hover { text-decoration: underline; }
            `}</style>

            <h2 className="mb-5 fw-black text-uppercase fs-1">KARTEN <span className="text-yellow">DENDA</span> 🛒</h2>

            {/* FILTROS */}
            <div className="mb-5 p-4 shadow-lg" style={{ background: '#111', border: '1px solid #222', borderRadius: '20px' }}>
                <Row className="g-3 align-items-end">
                    <Col md={8}>
                        <Form.Label className="text-yellow small fw-black text-uppercase ml-2" style={{ letterSpacing: '1.5px' }}>Bilatu Karta</Form.Label>
                        <Form.Control 
                            placeholder="Pikachu, Charizard..." 
                            className="form-control-amara py-2 px-3 shadow-sm"
                            style={{ borderRadius: '12px' }}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Label className="text-yellow small fw-black text-uppercase ml-2" style={{ letterSpacing: '1.5px' }}>Bilduma</Form.Label>
                        <Form.Select 
                            className="form-control-amara py-2 px-3 shadow-sm"
                            style={{ borderRadius: '12px' }}
                            onChange={(e) => setFilterSet(e.target.value)}
                        >
                            <option value="" style={{background: '#111'}}>Guztiak (Todas)</option>
                            {sets.map(s => (
                                <option key={s.id} value={s.name} style={{background: '#111'}}>{s.name}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>
            </div>

            {/* GRID */}
            <Row className="g-4">
                {filteredListings.length > 0 ? (
                    filteredListings.map(item => {
                        const isMyCard = user && item.user_id === user.id;

                        return (
                            <Col key={item.id} xs={12} sm={6} lg={4}>
                                <Card className="h-100 shop-card border-0 shadow-lg">
                                    <div className="image-container-dark position-relative">
                                        <Badge bg="dark" className="position-absolute shadow" style={{top: '15px', left: '15px', fontSize: '0.75rem', fontWeight: '800', border: '1px solid #333'}}>
                                            {item.card.card_set?.name}
                                        </Badge>
                                        
                                        {item.card.image_url ? (
                                            <Card.Img 
                                                src={item.card.image_url} 
                                                style={{ 
                                                    maxHeight: '230px', 
                                                    width: 'auto', 
                                                    objectFit: 'contain',
                                                    filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.7))' 
                                                }}
                                            />
                                        ) : (
                                            <div className="bg-secondary d-flex align-items-center justify-content-center mx-auto" style={{ height: '230px', width: '100%', borderRadius: '12px' }}>
                                                <span className="text-white small">Ez dago irudirik</span>
                                            </div>
                                        )}
                                    </div>

                                    <Card.Body className="d-flex flex-column px-4 pb-4">
                                        <Card.Title className="fw-black mb-2 fs-4 text-white text-uppercase" style={{ letterSpacing: '-0.5px' }}>
                                            {item.card.name}
                                        </Card.Title>
                                        
                                        <div className="small mb-4">
                                            <div className="text-light-gray fw-medium">Rarity: <span className="text-white fw-bold">{item.card.rarity}</span></div>
                                            <div className="mt-2 seller-link">
                                                Saltzailea: <span className="text-white">@{item.user.name}</span>
                                                {isMyCard && <span className="ms-2 badge bg-secondary text-white" style={{fontSize: '0.65rem'}}>ZU</span>}
                                            </div>
                                        </div>

                                        <div className="mt-auto border-top border-secondary pt-3">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h4 className="text-price mb-0">{parseFloat(item.price).toFixed(2)}€</h4>
                                                <Badge className={item.psa_grade ? "psa-badge" : "raw-badge shadow"}>
                                                    {item.psa_grade ? `PSA ${item.psa_grade}` : 'Raw'}
                                                </Badge>
                                            </div>

                                            <Button 
                                                className="btn-buy-amara w-100 d-flex align-items-center justify-content-center gap-2"
                                                onClick={() => handleBuy(item.id)}
                                                disabled={isMyCard}
                                            >
                                                {isMyCard ? "ZURE KARTA DA" : <>EROSI 🛒</>}
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })
                ) : (
                    <Col className="text-center py-5">
                        <h4 className="text-light-gray italic opacity-50 fw-light fs-5">Ez da emaitzarik aurkitu... 🔍</h4>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default Shop;