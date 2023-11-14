import { Navigate, useOutlet} from "react-router-dom";
import "../style/Layout.css";
import {useAuth} from "../hooks/useAuth";

const LoginLayout = () => {
    const { user } = useAuth();
    const outlet = useOutlet();

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="Login">
            {outlet}
        </div>
    )
};

export default LoginLayout;