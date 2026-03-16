import './bootstrap';
import '../css/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <--- Añadimos esto
import App from './components/App.jsx';
import axios from 'axios';

// Esto es vital para que Laravel reconozca tu sesión
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// Asegúrate de que apunte a tu servidor Laravel
axios.defaults.baseURL = 'http://localhost:8000';

if (document.getElementById('root')) {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    );
}