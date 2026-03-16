import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Image, Alert, ProgressBar, Badge } from 'react-bootstrap';
import { useUser } from './UserContext';
import axios from 'axios';

const Profile = () => {
    const { user, setUser } = useUser();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    
    // Estados de datos
    const [myCards, setMyCards] = useState([]);
    const [boughtCards, setBoughtCards] = useState([]); 
    const [activeListingsCount, setActiveListingsCount] = useState(0);
    const [totalCollectionValue, setTotalCollectionValue] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0); // Nuevo estado para ganancias
    const [loadingData, setLoadingData] = useState(true);

    // Estados para la venta
    const [sellingCard, setSellingCard] = useState(null); 
    const [saleData, setSaleData] = useState({ price: '', psa: '' });
    const [saleStatus, setSaleStatus] = useState(null);

    // 1. CARGAR DATOS
    const loadData = async () => {
        try {
            const response = await axios.get('/api/user/collection');
            
            setMyCards(response.data.cards || []);
            setTotalCollectionValue(response.data.total_value || 0); 
            setActiveListingsCount(response.data.active_listings || 0);
            setBoughtCards(response.data.bought_cards || []);
            setTotalEarnings(response.data.total_earnings || 0); // Cargamos las ganancias

            if (response.data.user) {
                setUser(response.data.user);
            }
            
            setLoadingData(false);
        } catch (err) {
            console.error("Errorea datuak kargatzean:", err);
            setLoadingData(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 2. LÓGICA DE NIVELES
    const xpMax = (user?.level || 1) * 100;
    const currentXp = user?.xp || 0;
    const progressXP = (currentXp / xpMax) * 100;

    const handleConfirmSale = async () => {
        if (!saleData.price || saleData.price <= 0) {
            alert("Mesedez, sartu baliozko prezio bat.");
            return;
        }
        try {
            await axios.post('/api/listings', {
                card_id: sellingCard.id,
                price: saleData.price,
                psa_grade: saleData.psa || null
            });
            setSaleStatus({ type: 'success', message: 'Karta salmentan jarri da!' });
            setSellingCard(null);
            setSaleData({ price: '', psa: '' });
            loadData(); 
        } catch (error) {
            setSaleStatus({ type: 'danger', message: 'Ezin izan da salmenta burutu.' });
        }
    };

    const handleRemove = async (e, cardId) => {
        e.preventDefault(); e.stopPropagation();
        if (!window.confirm("Ziur zaude?")) return;
        try {
            await axios.delete(`/api/user/collection/${cardId}`);
            loadData();
        } catch (error) { console.error(error); }
    };

    const handleUpload = () => {
        if (!selectedFile) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        axios.post('/user/avatar', formData).then(response => {
            setUser({...user, avatar_url: response.data.avatar_url});
            setSelectedFile(null);
        }).finally(() => setUploading(false));
    };

    if (!user) return <Container className="py-5 text-center">Saioa hasi behar duzu.</Container>;

    return (
        <Container className="py-5 text-start">
            <style>{`
                .card-container { position: relative; border-radius: 8px; cursor: pointer; }
                .remove-btn { position: absolute; top: -5px; left: -5px; z-index: 10; opacity: 0; transition: 0.2s; border-radius: 50%; }
                .card-container:hover .remove-btn { opacity: 1; }
                .card-hover:hover { transform: translateY(-3px); transition: 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important; }
                .selling-box { border: 2px dashed #198754; background-color: #f8fff9; }
                .xp-bar { height: 12px; border-radius: 10px; background-color: #e9ecef; }
                .stat-box { padding: 10px; border-radius: 8px; border: 1px solid #dee2e6; background-color: #f8f9fa; height: 100%; }
            `}</style>

            <Row className="g-4">
                <Col md={8}>
                    {/* --- HEADER --- */}
                    <Card className="shadow-sm p-4 mb-4 border-0">
                        <div className="d-flex align-items-center gap-4 border-bottom pb-4 mb-4">
                            <Image src={user.avatar_url || '/default-avatar.png'} roundedCircle style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="border shadow-sm" />
                            <div className="flex-grow-1">
                                <h2 className="fw-bold mb-1">{user.name}</h2>
                                <p className="text-muted small mb-3">{user.email}</p>
                                
                                <div className="d-flex align-items-center gap-3">
                                    <Badge bg="primary" className="px-3 py-2 fs-6">Maila {user.level}</Badge>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between mb-1 small fw-bold text-muted">
                                            <span>{currentXp} XP</span>
                                            <span>{xpMax} XP</span>
                                        </div>
                                        <ProgressBar now={progressXP} variant="success" className="xp-bar" animated />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ESTADÍSTICAS ACTUALIZADAS (4 COLUMNAS) */}
                        <Row className="text-center g-2">
                            <Col xs={6} lg={3}>
                                <div className="stat-box">
                                    <h5 className="fw-bold text-primary mb-0">{myCards.length}</h5>
                                    <div className="text-muted x-small fw-bold">Bilduma</div>
                                </div>
                            </Col>
                            <Col xs={6} lg={3}>
                                <div className="stat-box">
                                    <h5 className="fw-bold text-success mb-0">{activeListingsCount}</h5>
                                    <div className="text-muted x-small fw-bold">Salmentan</div>
                                </div>
                            </Col>
                            <Col xs={6} lg={3}>
                                <div className="stat-box">
                                    <h5 className="fw-bold text-warning mb-0">{new Intl.NumberFormat('de-DE').format(totalCollectionValue)}€</h5>
                                    <div className="text-muted x-small fw-bold">Balioa</div>
                                </div>
                            </Col>
                            <Col xs={6} lg={3}>
                                <div className="stat-box" style={{backgroundColor: '#f0fff4', borderColor: '#c3e6cb'}}>
                                    <h5 className="fw-bold text-success mb-0">{new Intl.NumberFormat('de-DE').format(totalEarnings)}€</h5>
                                    <div className="text-dark x-small fw-bold">Irabaziak 💰</div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* --- HISTORIAL DE COMPRAS --- */}
                    <Card className="shadow-sm p-4 border-0 mb-4">
                        <h5 className="fw-bold mb-3">Erositako Kartak 📦</h5>
                        {boughtCards.length > 0 ? (
                            <Row className="g-2 overflow-auto flex-nowrap pb-2">
                                {boughtCards.map(order => (
                                    <Col key={order.id} xs={5} sm={4} md={3}>
                                        <div className="p-2 border rounded bg-white h-100 card-hover text-center">
                                            <Image src={order.card.image_url} fluid rounded className="mb-2" />
                                            <div className="fw-bold x-small text-truncate">{order.card.name}</div>
                                            <div className="d-flex justify-content-between mt-1">
                                                <Badge bg="secondary" style={{fontSize: '9px'}}>{order.price}€</Badge>
                                                <Badge bg="warning" text="dark" style={{fontSize: '9px'}}>PSA {order.psa_grade || 'Raw'}</Badge>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Alert variant="light" className="text-muted small border-0 p-0 text-start">Oraindik ez duzu kartarik erosi.</Alert>
                        )}
                    </Card>

                    {/* --- VENTA --- */}
                    <Card className={`shadow-sm p-4 border-0 mb-4 ${sellingCard ? 'selling-box' : ''}`}>
                        <h5 className="fw-bold mb-3 text-start">Salmentan Jarri</h5>
                        {saleStatus && <Alert variant={saleStatus.type} dismissible onClose={() => setSaleStatus(null)} className="small">{saleStatus.message}</Alert>}
                        {sellingCard ? (
                            <Row className="g-3 align-items-center">
                                <Col xs={3}><Image src={sellingCard.image_url} fluid rounded className="shadow-sm" /></Col>
                                <Col xs={9}>
                                    <div className="d-flex gap-2 mb-2">
                                        <Form.Control size="sm" type="number" placeholder="Prezioa (€)" onChange={(e) => setSaleData({...saleData, price: e.target.value})} />
                                        <Form.Select size="sm" onChange={(e) => setSaleData({...saleData, psa: e.target.value})}>
                                            <option value="">PSA gabe</option>
                                            {[10,9,8,7,6].map(n => <option key={n} value={n}>PSA {n}</option>)}
                                        </Form.Select>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button variant="success" size="sm" className="flex-grow-1" onClick={handleConfirmSale}>Dendara Igo</Button>
                                        <Button variant="light" size="sm" onClick={() => setSellingCard(null)}>Utzi</Button>
                                    </div>
                                </Col>
                            </Row>
                        ) : <p className="text-muted small mb-0 italic text-start">Hautatu bildumako karta bat saltzeko.</p>}
                    </Card>

                    {/* --- MI COLECCIÓN --- */}
                    <Card className="shadow-sm p-4 border-0">
                        <h5 className="fw-bold mb-3 text-start">Nire Bilduma</h5>
                        <Row className="g-2">
                            {myCards.map(card => (
                                <Col key={card.id} xs={4} sm={3} md={2}>
                                    <div className="card-container" onClick={() => setSellingCard(card)}>
                                        <Button variant="danger" size="sm" className="remove-btn" onClick={(e) => handleRemove(e, card.id)}>×</Button>
                                        <Image src={card.image_url} fluid rounded className="card-hover border shadow-sm" />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>

                {/* --- LATERAL --- */}
                <Col md={4}>
                    <Card className="shadow-sm p-4 border-0 sticky-top" style={{top: '20px'}}>
                        <h5 className="fw-bold mb-3 text-start">Ezarpenak</h5>
                        <Form.Group className="mb-3 text-start">
                            <Form.Label className="small fw-bold">Profil argazkia</Form.Label>
                            <Form.Control type="file" size="sm" onChange={(e) => setSelectedFile(e.target.files[0])} />
                            <Button variant="dark" size="sm" className="w-100 mt-2" onClick={handleUpload} disabled={!selectedFile || uploading}>
                                {uploading ? 'Igotzen...' : 'Gorde Irudia'}
                            </Button>
                        </Form.Group>
                        <hr />
                        <div className="small text-muted text-start">
                            <div className="d-flex justify-content-between mb-2">
                                <span>XP Irabazita:</span>
                                <span className="fw-bold text-dark">{user.xp || 0}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Erosketak:</span>
                                <span className="fw-bold text-dark">{boughtCards.length}</span>
                            </div>
                            <div className="d-flex justify-content-between text-success fw-bold">
                                <span>Guztira Irabazita:</span>
                                <span>{totalEarnings}€</span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;