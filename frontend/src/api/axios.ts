import axios from 'axios';
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // NestJS backend
});

instance.interceptors.request.use((
    config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;
