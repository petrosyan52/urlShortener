import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import './Auth.css'; // Create this file for styling

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login</h2>

                {error && <p className="error-text">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>

                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </form>
        </div>
    );
}
