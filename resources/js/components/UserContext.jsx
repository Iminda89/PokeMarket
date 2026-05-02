import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkSession = async () => {
        try {
            const response = await axios.get('/api/user/profile');
            const userData = response.data.user || response.data;
            
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.warn("Sesioa ez da aurkitu");
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkSession();
    }, []); 

    const login = async (credentials) => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post('/login', credentials);
            await checkSession(); 
            return true;
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/logout');
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('isLoggedIn');
            window.location.href = '/';
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, isAuthenticated, loading, login, logout, checkSession }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);