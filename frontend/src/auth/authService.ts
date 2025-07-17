import axios from '../api/axios';

export async function register(email: string, password: string) {
    const res = await axios.post('/auth/register', { email, password });
    return res.data;
}

export async function login(email: string, password: string) {
    const res = await axios.post('/auth/login', { email, password });
    return res.data;
}
