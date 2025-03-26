import { useRoutes } from "react-router-dom";
import Signin from "../Authentication/Signin";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../components/Dashboard";

export default function Routes() {
    console.log("Accessing routes...",);
    const routes = [
        {
            path: "/signin",
            exact: true,
            element: <Signin />
        },
        {
            path: "/",
            exact: true,
            element: <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
            
        }
    ];
    const routeResult = useRoutes(routes);
    return routeResult;
}