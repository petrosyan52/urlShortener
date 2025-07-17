import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './pages/Dashboard'; // where users can create/view URLs
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <Routes>
                                <Route path="/dashboard" element={<Dashboard />} />
                                {/* You can add more protected routes here */}
                            </Routes>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
