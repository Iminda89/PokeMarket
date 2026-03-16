import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Al arrancar, intentamos leer si ya había un usuario guardado en el navegador
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user_session');
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(true);

    // Esta función actualizará tanto el estado como el almacenamiento local
    const handleSetUser = (data) => {
        if (!data) {
            localStorage.removeItem('user_session');
            setUser(null);
        } else {
            setUser(prev => {
                const updated = { ...prev, ...data };
                localStorage.setItem('user_session', JSON.stringify(updated));
                return updated;
            });
        }
    };

    useEffect(() => {
        fetch('/user-data')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    handleSetUser(data); // Actualizamos con datos frescos del servidor
                } else {
                    handleSetUser(null); // Si no hay sesión, limpiamos
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser: handleSetUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);