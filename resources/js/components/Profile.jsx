import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Image, Alert, ProgressBar, Badge, Spinner } from 'react-bootstrap';
import { useUser } from './UserContext';
import axios from 'axios';
import { FaWallet, FaArrowLeft, FaSync, FaCamera, FaStore, FaCoins } from 'react-icons/fa';

const Profile = () => {
    const { user, setUser, loading } = useUser();
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    
    // Estados de datos
    const [myCards, setMyCards] = useState([]);
    const [boughtCards, setBoughtCards] = useState([]); 
    const [activeListingsCount, setActiveListingsCount] = useState(0);
    const [totalCollectionValue, setTotalCollectionValue] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [loadingData, setLoadingData] = useState(false);

    // Estados para la venta
    const [sellingCard, setSellingCard] = useState(null); 
    const [saleData, setSaleData] = useState({ price: '', psa: '' });
    const [saleStatus, setSaleStatus] = useState(null);

    const loadData = useCallback(async () => {
        setLoadingData(true);
        try {
            const response = await axios.get('/api/user/collection');
            setMyCards(response.data.cards || []);
            setTotalCollectionValue(response.data.total_value || 0); 
            setActiveListingsCount(response.data.active_listings || 0);
            setBoughtCards(response.data.bought_cards || []);
            setTotalEarnings(response.data.total_earnings || 0);
            
            // Refrescar los datos del usuario (para el saldo)
            const userRes = await axios.get('/api/user-check');
            setUser(userRes.data);
        } catch (err) {
            console.error("Errorea datuak kargatzean:", err);
        } finally {
            setLoadingData(false);
        }
    }, [setUser]); 

    useEffect(() => {
        if (!loading && user?.id) {
            loadData();
        }
    }, [loading, user?.id, loadData]);

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
        } catch (err) {
            console.warn("Saioa itxia zegoen");
        } finally {
            if (setUser) setUser(null);
            localStorage.removeItem('user_session');
            window.location.href = "/";
        }
    };

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
        if (!window.confirm("Ziur zaude bildumatik kendu nahi duzula?")) return;
        try {
            await axios.delete(`/api/user/collection/${cardId}`);
            loadData();
        } catch (error) { console.error(error); }
    };

    const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
        // Asegúrate de enviar la cabecera adecuada para archivos
        const response = await axios.post('/api/user/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true, // Importante si usas Sanctum / sesiones
        });

        setUser({ ...user, avatar_url: response.data.avatar_url });
        setSelectedFile(null);
        alert("Irudia ondo igo da!");
    } catch (error) {
        console.error("Errorea irudia igotzean:", error);
        alert(error.response?.data?.message || "Ezin izan da irudia igo.");
    } finally {
        setUploading(false);
    }
};

    if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center bg-dark text-white"><Spinner animation="grow" variant="warning" /></div>;
    if (!user) return <Container className="py-5 text-center text-white">Saioa hasi behar duzu profil hau ikusteko.</Container>;

    const xpMax = (user?.level || 1) * 100;
    const progressXP = ((user?.xp || 0) / xpMax) * 100;

    return (
        <Container className="py-4 font-custom text-white">
            <style>{`
                .profile-card { background: #0d0d0d; border: 1px solid #222; border-radius: 20px; }
                .stat-box-amara { background: #151515; border: 1px solid #333; border-radius: 12px; padding: 15px; height: 100%; transition: 0.3s; }
                .stat-box-amara:hover { border-color: #facc15; }
                .xp-bar-amara { height: 10px; background: #222; border-radius: 10px; overflow: hidden; }
                .card-item-amara { background: #151515; border-radius: 12px; padding: 10px; border: 1px solid #222; transition: 0.3s; position: relative; cursor: pointer; }
                .card-item-amara:hover { border-color: #facc15; transform: translateY(-3px); }
                .remove-badge { position: absolute; top: -5px; right: -5px; cursor: pointer; z-index: 10; font-size: 1.2rem; background: #dc3545 !important; color: white !important; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
                .btn-yellow-amara { background: #facc15 !important; color: black !important; font-weight: 900; border: none; border-radius: 10px; padding: 10px 20px; transition: 0.3s; }
                .btn-yellow-amara:hover { background: #eab308 !important; transform: scale(1.02); }
                .btn-dark-amara { background: #1a1a1a !important; border: 1px solid #333 !important; color: white !important; font-weight: 700; border-radius: 10px; }
                .text-yellow { color: #facc15 !important; }
                .text-amara-muted { color: #888888 !important; }
                
                .wallet-section {
                    background: linear-gradient(135deg, #1a1a1a 0%, #050505 100%);
                    border: 1px solid #2ecc71;
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: 0 4px 15px rgba(46, 204, 113, 0.1);
                }
                .balance-display {
                    color: #2ecc71;
                    font-size: 2.2rem;
                    font-weight: 900;
                    font-family: 'monospace';
                    text-shadow: 0 0 10px rgba(46, 204, 113, 0.2);
                }
            `}</style>

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="fw-black text-uppercase fs-2 mb-0 italic">NIRE <span className="text-yellow">PROFILA</span></h1>
                    <p className="text-amara-muted small mb-0 fw-bold">KUDEAKETA PANELA</p>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-light" onClick={loadData} className="rounded-circle"><FaSync /></Button>
                    <Button onClick={handleLogout} className="btn-yellow-amara d-flex align-items-center gap-2 shadow-sm">
                        SAIOA ITXI
                    </Button>
                </div>
            </div>

            <Row className="g-4">
                <Col lg={8}>
                    {/* INFO PRINCIPAL */}
                    <Card className="profile-card p-4 mb-4 shadow-lg border-0">
                        <Row className="align-items-center">
                            <Col md={3} className="text-center">
                                <div className="position-relative d-inline-block">
                                    <Image src={user.avatar_url || '/default-avatar.png'} roundedCircle className="border border-dark shadow" style={{ width: '130px', height: '130px', objectFit: 'cover' }} />
                                    <Badge bg="warning" text="dark" className="position-absolute bottom-0 end-0 rounded-circle p-2 border border-dark"><FaCamera /></Badge>
                                </div>
                            </Col>
                            <Col md={9}>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h3 className="fw-black mb-0 italic text-uppercase text-white">{user.name}</h3>
                                        <p className="text-amara-muted small">{user.email}</p>
                                    </div>
                                    <Badge className="bg-primary px-3 py-2 fs-6">MAILA {user.level}</Badge>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between small mb-1 fw-bold">
                                        <span className="text-yellow">{user.xp} XP</span>
                                        <span className="text-amara-muted">{xpMax} XP</span>
                                    </div>
                                    <div className="xp-bar-amara">
                                        <div className="bg-warning h-100" style={{ width: `${progressXP}%`, transition: 'width 1s ease' }}></div>
                                    </div>
                                </div>

                                {/* WALLET - SALDO DISPONIBLE */}
                                <div className="wallet-section d-flex align-items-center justify-content-between">
                                    <div>
                                        <div className="text-amara-muted small fw-black text-uppercase mb-1">Dagoen Saldoa</div>
                                        <div className="balance-display">
                                            {Number(user.balance || 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })}€
                                        </div>
                                    </div>
                                    <FaWallet size={40} className="text-success opacity-50" />
                                </div>
                            </Col>
                        </Row>

                        <Row className="mt-4 g-3 text-center">
                            <Col xs={6} md={3}>
                                <div className="stat-box-amara">
                                    <div className="text-amara-muted small fw-bold text-uppercase mb-1">Bilduma</div>
                                    <h4 className="fw-black mb-0">{myCards.length}</h4>
                                </div>
                            </Col>
                            <Col xs={6} md={3}>
                                <div className="stat-box-amara">
                                    <div className="text-amara-muted small fw-bold text-uppercase mb-1">Merkatuan</div>
                                    <h4 className="fw-black mb-0 text-yellow">{activeListingsCount}</h4>
                                </div>
                            </Col>
                            <Col xs={6} md={3}>
                                <div className="stat-box-amara">
                                    <div className="text-amara-muted small fw-bold text-uppercase mb-1">Balioa</div>
                                    <h4 className="fw-black mb-0">{Number(totalCollectionValue).toFixed(0)}€</h4>
                                </div>
                            </Col>
                            <Col xs={6} md={3}>
                                <div className="stat-box-amara">
                                    <div className="text-success small fw-bold text-uppercase mb-1">Irabaziak</div>
                                    <h4 className="fw-black mb-0">+{Number(totalEarnings).toFixed(0)}€</h4>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* AZKEN EROSKETAK */}
                    <Card className="profile-card p-4 mb-4 border-0">
                        <h5 className="fw-black italic text-uppercase mb-4"><FaStore className="me-2 text-yellow"/> AZKEN EROSKETAK</h5>
                        {boughtCards.length > 0 ? (
                            <div className="d-flex gap-3 overflow-auto pb-3">
                                {boughtCards.map(order => (
                                    <div key={order.id} style={{minWidth: '140px'}} className="card-item-amara text-center">
                                        {order.card?.image_url ? (
                                            <Image src={order.card?.image_url} fluid rounded className="mb-2" style={{ maxHeight: '140px', objectFit: 'contain', width: '100%' }} />
                                        ) : (
                                            <div className="bg-secondary mb-2 d-flex align-items-center justify-content-center mx-auto" style={{ height: '140px', width: '100%', borderRadius: '8px' }}>
                                                <span className="text-white small">Ez dago irudirik</span>
                                            </div>
                                        )}
                                        <div className="fw-bold small text-truncate text-white">{order.card?.name}</div>
                                        <div className="text-success fw-bold">{order.price}€</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-amara-muted italic small">Oraindik ez duzu ezer erosi merkatuan.</p>
                        )}
                    </Card>

                    {/* NIRE BILDUMA (SALTZEKO) */}
                    <Card className="profile-card p-4 mb-4 border-0">
                        <h5 className="fw-black italic text-uppercase mb-4">NIRE <span className="text-yellow">BILDUMA</span></h5>
                        {loadingData ? (
                            <div className="text-center py-4"><Spinner animation="border" variant="warning" /></div>
                        ) : (
                            <Row className="g-3">
                                {myCards.map(card => (
                                    <Col key={card.id} xs={4} sm={3} md={2}>
                                        <div className="card-item-amara" onClick={() => setSellingCard(card)}>
                                            <div className="remove-badge" onClick={(e) => handleRemove(e, card.id)}>×</div>
                                            {card.image_url ? (
                                                <Image src={card.image_url} fluid rounded className="mb-2" style={{ maxHeight: '140px', objectFit: 'contain', width: '100%' }} />
                                            ) : (
                                                <div className="bg-secondary mb-2 d-flex align-items-center justify-content-center mx-auto" style={{ height: '140px', width: '100%', borderRadius: '8px' }}>
                                                    <span className="text-white small">Ez dago irudirik</span>
                                                </div>
                                            )}
                                            <div className="text-center text-yellow fw-bold" style={{fontSize: '0.6rem'}}>SALTZEKO SARTU</div>
                                        </div>
                                    </Col>
                                ))}
                                {myCards.length === 0 && <p className="text-amara-muted p-3">Ez duzu kartarik bilduman.</p>}
                            </Row>
                        )}
                    </Card>
                </Col>

                {/* COLUMNA DERECHA */}
                <Col lg={4}>
                    {/* FORMULARIO VENTA FLOTANTE */}
                    {sellingCard && (
                        <Card className="profile-card p-4 mb-4 border-warning shadow-lg">
                            <h6 className="fw-black text-uppercase text-yellow mb-3">Salmentan Jarri</h6>
                            <div className="text-center mb-3">
                                {sellingCard.image_url ? (
                                    <Image src={sellingCard.image_url} width={100} rounded className="shadow" />
                                ) : (
                                    <div className="bg-secondary d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '100px', height: '100px', borderRadius: '50%' }}>
                                        <span className="text-white small" style={{ fontSize: '0.65rem' }}>Ez dago irudirik</span>
                                    </div>
                                )}
                                <div className="fw-bold mt-2">{sellingCard.name}</div>
                            </div>
                            <Form.Group className="mb-2">
                                <Form.Label className="small text-amara-muted">Prezioa (€)</Form.Label>
                                <Form.Control className="bg-dark text-white border-secondary" type="number" value={saleData.price} onChange={(e) => setSaleData({...saleData, price: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small text-amara-muted">PSA Graduazioa</Form.Label>
                                <Form.Select className="bg-dark text-white border-secondary" value={saleData.psa} onChange={(e) => setSaleData({...saleData, psa: e.target.value})}>
                                    <option value="">RAW (Graduatu gabe)</option>
                                    {[10,9,8,7,6].map(n => <option key={n} value={n}>PSA {n}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Button className="btn-yellow-amara w-100 mb-2" onClick={handleConfirmSale}>DENDARA IGO</Button>
                            <Button variant="link" className="text-amara-muted w-100 btn-sm text-decoration-none" onClick={() => setSellingCard(null)}>Utzi</Button>
                        </Card>
                    )}

                    <Card className="profile-card p-4 sticky-top" style={{top: '100px'}}>
                        <h5 className="fw-black text-uppercase mb-4">EZARPENAK</h5>
                        <Form.Group className="mb-4">
                            <Form.Label className="small fw-bold text-amara-muted">ALDATU AVATARRA</Form.Label>
                            <Form.Control type="file" size="sm" className="bg-dark text-white border-dark mb-2" onChange={(e) => setSelectedFile(e.target.files[0])} />
                            <Button className="btn-dark-amara w-100" onClick={handleUpload} disabled={!selectedFile || uploading}>
                                {uploading ? 'Igotzen...' : 'GORDE IRUDIA'}
                            </Button>
                        </Form.Group>
                        <hr className="border-secondary opacity-25" />
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-amara-muted small">Erosketak guztira:</span>
                            <span className="fw-bold">{boughtCards.length}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-amara-muted small">Bildumaren balioa:</span>
                            <span className="fw-bold text-yellow">{totalCollectionValue}€</span>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;