import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Card, Badge, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const SetDetail = () => {
    const { id } = useParams();
    const [setData, setSetData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("default"); // Estado para la ordenación

    useEffect(() => {
        fetch(`/api/sets/${id}`)
            .then(res => res.json())
            .then(data => setSetData(data));
    }, [id]);

    if (!setData) return <Container className="py-5 text-center">Kargatzen...</Container>;

    // 1. Primero filtramos por nombre
    let filteredCards = setData.cards.filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Luego ordenamos la lista filtrada
    if (sortBy === "price-asc") {
    filteredCards.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
        filteredCards.sort((a, b) => b.price - a.price);
    }

    return (
        <Container className="py-4">
            {/* 1. CORRECCIÓN: Volvemos a poner el Breadcrumb y el título del SET */}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{to: "/bildumak"}}>Bildumak</Breadcrumb.Item>
                <Breadcrumb.Item active>{setData.name}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
                <div>
                    <h1 className="fw-bold mb-0 text-uppercase">{setData.name} Singles</h1>
                    <p className="text-muted mb-0">{filteredCards.length} karta aurkituta</p>
                </div>
                
                <div className="d-flex gap-2 flex-grow-1 justify-content-end">
                    {/* BUSCADOR */}
                    <div style={{ maxWidth: '250px' }}>
                        <Form.Label className="small fw-bold text-muted">Bilatu:</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Adib. Pikachu..." 
                            className="border-0 shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* SELECTOR DE ORDENACIÓN */}
                    <div style={{ maxWidth: '200px' }}>
                        <Form.Label className="small fw-bold text-muted">Ordenatu:</Form.Label>
                        <Form.Select 
                            className="border-0 shadow-sm"
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="default">Guztiak</option>
                            <option value="price-asc">Merkeenak lehenago</option>
                            <option value="price-desc">Garestienak lehenago</option>
                        </Form.Select>
                    </div>
                </div>
            </div>

            <Row>
                {filteredCards.map(card => (
                    <Col key={card.id} xs={6} md={3} lg={2} className="mb-4">
                        <Link to={`/karta/${card.id}`} className="text-decoration-none">
                            <Card className="h-100 border-0 shadow-sm text-center card-pokemon">
                                <div className="p-2">
                                    <Card.Img variant="top" src={card.image_url} alt={card.name} />
                                </div>
                                <Card.Body className="p-2 pt-0">
                                    <Card.Title className="small fw-bold mb-1 text-dark">
                                        {card.name}
                                    </Card.Title>
                                    <Badge bg="secondary" className="mb-2 very-small">
                                        {card.rarity}
                                    </Badge>
                                    <div className="price-tag text-primary fw-bold">
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