import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cookbook-j58r.onrender.com/',
});

// добавление интерцептора для токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Добавьте обработку ответов
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log('Токен невалидный, логаут');
            localStorage.removeItem('token');
            window.location.href = '/login';  // Перенаправление
        }
        return Promise.reject(error);
    }
);

export default api;
