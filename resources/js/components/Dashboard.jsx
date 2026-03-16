import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Necesario para leer la URL

const Dashboard = () => {
    const [stats, setStats] = useState({ cards_count: 0, total_spent: 0, xp: 0 });
    const [showBanner, setShowBanner] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // 1. Cargar estadísticas del usuario
        axios.get('/api/user/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error("Errorea datuak kargatzean", err));

        // 2. Comprobar si venimos de confirmar el email
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('verified') === '1') {
            setShowBanner(true);
            // El mensaje desaparece solo tras 6 segundos
            setTimeout(() => setShowBanner(false), 6000);
        }
    }, [location]);

    return (
        <div className="container mt-5">
            {/* --- SECCIÓN DE NOTIFICACIÓN --- */}
            {showBanner && (
                <div className="alert alert-success shadow-lg border-0 mb-4 animate__animated animate__fadeInDown" 
                     style={{ borderRadius: '15px', background: '#d4edda', color: '#155724' }}>
                    <div className="d-flex align-items-center">
                        <span style={{ fontSize: '1.5rem', marginRight: '15px' }}>✅</span>
                        <div>
                            <h5 className="mb-0 fw-bold">Posta elektronikoa berretsia!</h5>
                            <small>Zure kontua erabat aktibatuta dago orain.</small>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Nire Dashboard-a</h2>
                <span className="badge bg-dark px-3 py-2 text-uppercase" style={{ letterSpacing: '1px' }}>
                    Entrenatzailea
                </span>
            </div>

            <div className="row">
                {/* Carta de XP */}
                <div className="col-md-4">
                    <div className="card text-white mb-3 shadow border-0" 
                         style={{ background: 'linear-gradient(45deg, #3b4cca, #0a285f)', borderRadius: '15px' }}>
                        <div className="card-body p-4">
                            <h5 className="card-title opacity-75">Zure XP-a</h5>
                            <p className="card-text display-6 fw-bold mb-0">{stats.xp} <small className="h6">XP</small></p>
                        </div>
                    </div>
                </div>

                {/* Carta de Cartas Compradas */}
                <div className="col-md-4">
                    <div className="card text-white mb-3 shadow border-0" 
                         style={{ background: 'linear-gradient(45deg, #28a745, #1e7e34)', borderRadius: '15px' }}>
                        <div className="card-body p-4">
                            <h5 className="card-title opacity-75">Bildutako Kartak</h5>
                            <p className="card-text display-6 fw-bold mb-0">{stats.cards_count}</p>
                        </div>
                    </div>
                </div>

                {/* Carta de Gasto Total (Opcional, la añado para rellenar el hueco) */}
                <div className="col-md-4">
                    <div className="card text-white mb-3 shadow border-0" 
                         style={{ background: 'linear-gradient(45deg, #ffc107, #e0a800)', borderRadius: '15px' }}>
                        <div className="card-body p-4 text-dark">
                            <h5 className="card-title opacity-75 fw-bold">Guztira Gastatua</h5>
                            <p className="card-text display-6 fw-bold mb-0">{stats.total_spent} <small className="h6">€</small></p>
                        </div>
                    </div>
                </div>
            </div>
            
            <hr className="my-5 opacity-25" />
            
            {/* Aquí podrías poner una lista de sus últimas cartas compradas */}
        </div>
    );
};

export default Dashboard;