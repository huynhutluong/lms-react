import {Link, Navigate, Outlet, useOutlet} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";
import Navigation from "../components/Navigation";
import Header from "../components/Header";

export const ProtectedLayout = () => {
    const { user } = useAuth();
    const outlet = useOutlet();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="Page">
            <div className="Nav">
                <Navigation />
            </div>
            <div className="Main">
                <div className="Head">
                    <Header />
                </div>
                {outlet}
            </div>
        </div>
    )
};