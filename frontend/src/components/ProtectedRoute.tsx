import { Navigate } from 'react-router-dom';
import {JSX} from "react";

interface Props {
    children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
