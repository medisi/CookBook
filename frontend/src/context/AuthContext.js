import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    console.log('Токен истёк, логаут');
                    logout();
                } else {
                    setUser({
                        _id: decoded.id,
                        email: decoded.email,
                        phone: decoded.phone,
                        nickname: decoded.nickname,
                        token: token
                    });
                }
            } catch (err) {
                console.error('Токен повреждён, очищаем: ', err);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        try {
            const decoded = jwtDecode(token);
            setUser({
                _id: decoded.id,
                email: decoded.email,
                phone: decoded.phone,
                nickname: decoded.nickname,
                token: token
            });
        } catch (err) {
            console.error('Ошибка при логине: ', err);
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            { children }
        </AuthContext.Provider>
    )
};