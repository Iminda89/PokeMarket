import './bootstrap';
import '../css/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App.jsx';
import axios from 'axios';

// 1. Configuración de Base
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

// ELIMINAMOS baseURL si usamos php artisan serve (puerto 8000 para todo)
// axios.defaults.baseURL = 'http://localhost:8000'; 

// 2. Interceptor con control de bucles
axios.interceptors.response.use(
    response => response,
    async error => {
        const config = error.config;

        // Comprobamos si la petición ya fue reintentada
        if (error.response && error.response.status === 419) {
            
            if (config._retry) {
                config._retry = false;
                return Promise.reject(error);
            }

            config._retry = true;
            console.warn("CSRF detectado. Intentando refrescar token...");
            
            // Intentamos recuperar el token automáticamente una vez
            try {
                await axios.get('/sanctum/csrf-cookie');
                return axios(config); // Reintenta la petición original
            } catch (e) {
                console.error("No se pudo recuperar el token CSRF");
                config._retry = false;
                return Promise.reject(error);
            }
        }

        if (error.response && error.response.status === 401) {
            // Solo log, no redirigir bruscamente para no romper la UX
            console.warn("Usuario no autenticado (401)");
        }
        
        return Promise.reject(error);
    }
);

const renderApp = async () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    const root = ReactDOM.createRoot(rootElement);

    try {
        // Pedimos la cookie antes de arrancar
        await axios.get('/sanctum/csrf-cookie');
        
        root.render(
            <React.StrictMode>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </React.StrictMode>
        );
    } catch (error) {
        console.error("Error inicializando Sanctum:", error);
        root.render(<BrowserRouter><App /></BrowserRouter>);
    }
};

renderApp();