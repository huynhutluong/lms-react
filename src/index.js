import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import {AuthProvider} from "./hooks/useAuth";
import App from "./App";
import 'semantic-ui-css/semantic.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//     <StrictMode>
//         <BrowserRouter>
//             <AuthProvider>
//                     <App />
//             </AuthProvider>
//         </BrowserRouter>
//     </StrictMode>
// );

root.render(
    <BrowserRouter>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </BrowserRouter>
);


