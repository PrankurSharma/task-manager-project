import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { auth } from "../api/firebase";

interface ProtectedProps {
    children: ReactNode
}

export default function ProtectedRoute ({ children }: ProtectedProps) {

    if (!auth.currentUser) {
        return <Navigate to="/signin" />
    }
    return children;
}