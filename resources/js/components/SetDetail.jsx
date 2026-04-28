import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Card, Badge, Breadcrumb, Spinner } from 'react-bootstrap';
import axios from 'axios';

const SetDetail = () => {
    const { id } = useParams();
    const [setData, setSetData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/sets/${id}`)
            .then(res => {
                setSetData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Errorea datuak kargatzean", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <Container className="py-5 text-center vh-100 d-flex flex-column justify-content-center align-items-center bg-pm-dark text-white">
                <Spinner animation="border" variant="warning" />
                <p className="mt-3 fw-bold text-uppercase">Kartak bilatzen...</p>
            </Container>
        );
    }

    if (!setData) return <Container className="py-5 text-center text-white text-uppercase fw-black">Bilduma ez da aurkitu.</Container>;

    let filteredCards = (setData.cards || []).filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "price-asc") {
        filteredCards.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
        filteredCards.sort((a, b) => b.price - a.price);
    }

    return (
        <Container className="py-4 text-white">
            <style>{`
                .breadcrumb-amara .breadcrumb-item + .breadcrumb-item::before { color: #444; }
                .breadcrumb-amara a { color: #aaaaaa; text-decoration: none; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; }
                .breadcrumb-amara .active { color: #facc15; font-weight: 900; text-transform: uppercase; font-size: 0.75rem; }
                
                .set-header-title { font-weight: 900; letter-spacing: -1px; text-transform: uppercase; }
                .text-yellow { color: #facc15 !important; }
                .text-amara-muted { color: #aaaaaa !important; }
                
                .card-pokemon-dark { 
                    background: #111; 
                    border: 1px solid #222; 
                    border-radius: 15px; 
                    transition: 0.3s;
                }
                .card-pokemon-dark:hover { 
                    border-color: #facc15; 
                    transform: translateY(-5px); 
                }
                
                .form-control-amara { 
                    background: #1a1a1a !important; 
                    border: 1px solid #333 !important; 
                    color: white !important; 
                    border-radius: 8px; 
                }
                .form-control-amara:focus { border-color: #facc15; box-shadow: none; }
                
                /* CORRECCIÓN DEL PLACEHOLDER */
                .form-control-amara::placeholder { 
                    color: #999 !important; 
                    opacity: 1; 
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .card-img-wrapper { background: #1a1a1a; border-radius: 10px; padding: 10px; margin-bottom: 10px; }
            `}</style>

            <Breadcrumb className="breadcrumb-amara mb-4">
                <Breadcrumb.Item linkAs={Link} linkProps={{to: "/bildumak"}}>Bildumak</Breadcrumb.Item>
                <Breadcrumb.Item active>{setData.name}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="d-flex flex-wrap justify-content-between align-items-end mb-5 gap-3">
                <div>
                    <h1 className="set-header-title fs-2 mb-0">{setData.name} <span className="text-yellow">SINGLES</span></h1>
                    <p className="text-amara-muted mb-0 small fw-bold uppercase">{filteredCards.length} KARTA AURKITUTA</p>
                </div>
                
                <div className="d-flex gap-2 flex-grow-1 justify-content-end">
                    <div style={{ maxWidth: '200px' }}>
                        <Form.Control 
                            type="text" 
                            placeholder="BILATU..." 
                            className="form-control-amara form-control-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ maxWidth: '180px' }}>
                        <Form.Select 
                            className="form-control-amara form-select-sm"
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="default" style={{background: '#1a1a1a'}}>GUZTIAK</option>
                            <option value="price-asc" style={{background: '#1a1a1a'}}>PREZIOA: TXIKIENA</option>
                            <option value="price-desc" style={{background: '#1a1a1a'}}>PREZIOA: HANDIENA</option>
                        </Form.Select>
                    </div>
                </div>
            </div>

            <Row className="g-3">
                {filteredCards.map(card => (
                    <Col key={card.id} xs={6} sm={4} md={3} lg={2}>
                        <Link to={`/karta/${card.id}`} className="text-decoration-none">
                            <Card className="h-100 card-pokemon-dark p-2 shadow-lg">
                                <div className="card-img-wrapper">
                                    <Card.Img 
                                        variant="top" 
                                        src={card.image_url || null}
                                        alt={card.name} 
                                        loading="lazy"
                                        style={{ filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.5))' }}
                                    />
                                </div>
                                <Card.Body className="p-1 text-center">
                                    <Card.Title className="small fw-black text-uppercase text-white text-truncate mb-1">
                                        {card.name}
                                    </Card.Title>
                                    <div className="text-amara-muted x-small mb-2 fw-bold italic" style={{ fontSize: '0.65rem' }}>
                                        {card.rarity}
                                    </div>
                                    <div className="text-yellow fw-black fs-6 border-top border-dark pt-2">
                                        {card.price} €
                                    </div>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SetDetail;