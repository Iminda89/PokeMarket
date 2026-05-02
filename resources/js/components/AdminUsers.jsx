import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Table, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaTrash, FaUserShield, FaSearch, FaWallet, FaStar, FaSync } from 'react-icons/fa';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [error, setError] = useState(null);

    // 1. Definimos fetchUsers con useCallback para poder reusarlo en efectos
    const fetchUsers = useCallback(async () => {
        try {
            const res = await axios.get('/api/admin/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError("Ezin izan dira erabiltzaileak kargatu.");
            setLoading(false);
        }
    }, []);

    // 2. Actualización automática al cargar y al volver a la pestaña (focus)
    useEffect(() => {
        fetchUsers();

        // Si el admin cambia de pestaña para comprar y vuelve, los datos se refrescan solos
        window.addEventListener('focus', fetchUsers);
        return () => window.removeEventListener('focus', fetchUsers);
    }, [fetchUsers]);

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Ziur zaude ${name} ezabatu nahi duzula?`)) return;
        try {
            await axios.delete(`/api/admin/users/${id}`);
            fetchUsers(); // Refrescamos tras borrar
        } catch (err) {
            alert("Errorea erabiltzailea ezabatzean.");
        }
    };

    const processedUsers = users
        .filter(u => 
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.id.toString().includes(searchTerm)
        )
        .sort((a, b) => {
            if (sortBy === "level-desc") return b.level - a.level;
            if (sortBy === "money-desc") return b.balance - a.balance;
            if (sortBy === "money-asc") return a.balance - b.balance;
            return 0;
        });

    return (
        <Container className="py-5 text-white">
            <style>{`
                .admin-content-card { background: #0a0a0a; border: 1px solid #222; border-radius: 20px; }
                .text-yellow { color: #facc15 !important; }
                .text-amara-muted { color: #888888 !important; }
                
                .amara-table { color: white !important; vertical-align: middle; }
                .amara-table thead th { 
                    background: #151515; 
                    border-bottom: 2px solid #333; 
                    color: #facc15; 
                    text-transform: uppercase; 
                    font-size: 0.75rem; 
                    padding: 18px 15px;
                }
                .amara-table td { border-bottom: 1px solid #1a1a1a; padding: 16px 15px; background: transparent; }
                .amara-table tr:hover td { background: #1a1a1a !important; }

                .user-name-text { color: #ffffff !important; font-size: 1.05rem; letter-spacing: 0.3px; }
                .user-email-text { color: #999999 !important; font-size: 0.8rem; }

                .search-input-group, .filter-select-group { 
                    background: #111; 
                    border: 1px solid #333; 
                    border-radius: 12px; 
                    padding: 5px 15px; 
                }
                .form-control-amara { 
                    background: transparent !important; 
                    border: none !important; 
                    color: white !important; 
                    box-shadow: none !important;
                    font-size: 0.9rem;
                }
                .form-control-amara::placeholder { color: #555; }
                
                .level-badge { background: #1e3a8a; color: #60a5fa; font-weight: 800; border: 1px solid #2563eb; }
                
                /* CAMBIO: Color de dinero a verde neón con visibilidad alta */
                .money-text { 
                    color: #2ecc71 !important; 
                    font-weight: 800; 
                    font-family: 'Courier New', monospace;
                    text-shadow: 0 0 8px rgba(46, 204, 113, 0.3);
                }

                .btn-refresh {
                    color: #666;
                    transition: all 0.3s ease;
                }
                .btn-refresh:hover { color: #facc15; transform: rotate(180deg); }
            `}</style>

            {/* Cabecera */}
            <div className="d-flex align-items-center justify-content-between mb-5">
                <div className="d-flex align-items-center gap-3">
                    <Button 
                        variant="outline-light" 
                        onClick={() => navigate('/admin')}
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '45px', height: '45px', border: '1px solid #333' }}
                    >
                        <FaArrowLeft />
                    </Button>
                    <div>
                        <h2 className="fw-black text-uppercase mb-0 italic">
                            <FaUserShield className="text-yellow me-2" /> ERABILTZAILEEN <span className="text-yellow">KUDEAKETA</span>
                        </h2>
                        <p className="text-amara-muted mb-0 small uppercase fw-bold">Guztira: {processedUsers.length} kide aurkituta</p>
                    </div>
                </div>
                {/* Botón de refresco manual */}
                <Button variant="link" className="btn-refresh" onClick={fetchUsers}>
                    <FaSync size={20} />
                </Button>
            </div>

            {/* Herramientas */}
            <Row className="mb-4 g-3">
                <Col md={7}>
                    <div className="search-input-group d-flex align-items-center">
                        <FaSearch className="text-muted me-2" />
                        <Form.Control 
                            type="text" 
                            className="form-control-amara"
                            placeholder="Bilatu..." 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </Col>
                <Col md={5}>
                    <div className="filter-select-group d-flex align-items-center">
                        <Form.Select 
                            className="form-control-amara"
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="default">ORDENATU: LEHENETSIA</option>
                            <option value="level-desc">MAILA: HANDIENA</option>
                            <option value="money-desc">DIRUA: GEHIEN</option>
                        </Form.Select>
                    </div>
                </Col>
            </Row>

            {/* Tabla de Usuarios */}
            <Card className="admin-content-card border-0 shadow-lg overflow-hidden">
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="warning" />
                        </div>
                    ) : (
                        <Table responsive className="amara-table mb-0">
                            <thead>
                                <tr>
                                    <th style={{width: '80px'}}>ID</th>
                                    <th>ERABILTZAILEA</th>
                                    <th className="text-center" style={{width: '150px'}}><FaStar size={12} className="me-1"/> MAILA</th>
                                    <th className="text-center" style={{width: '150px'}}><FaWallet size={12} className="me-1"/> DIRUA</th>
                                    <th className="text-end" style={{width: '100px'}}>EKINTZAK</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedUsers.map(u => (
                                    <tr key={u.id}>
                                        <td className="text-amara-muted font-monospace">#{u.id}</td>
                                        <td>
                                            <div className="fw-bold user-name-text">{u.name}</div>
                                            <div className="user-email-text">{u.email}</div>
                                        </td>
                                        <td className="text-center">
                                            <Badge className="level-badge px-3 py-2">LVL {u.level || 1}</Badge>
                                        </td>
                                        <td className="text-center money-text fs-5">
                                            {/* Aseguramos que el balance se renderice correctamente */}
                                            {Number(u.balance).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                                        </td>
                                        <td className="text-end">
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm" 
                                                className="border-0 bg-transparent text-danger p-2"
                                                onClick={() => handleDeleteUser(u.id, u.name)}
                                            >
                                                <FaTrash size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminUsers;