import { Outlet, Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import "../style/Layout.css";
import Header from "../components/Header";

const Layout = () => {
    return (
        <>
            <div className="Page">
                <div className="Nav">
                    <Navigation />
                </div>
                <div className="Main">
                    <div className="Head">
                        <Header />
                    </div>
                    <Outlet />
                </div>
            </div>
        </>
    )
};

export default Layout;