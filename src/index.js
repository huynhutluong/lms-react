import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import CourseList from "./pages/CourseList";
import Course from "./pages/Course";
import Search from "./pages/Search";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import CourseManagement from "./pages/CourseManagement";
import YourProfile from "./pages/YourProfile";
import YourCourse from "./pages/YourCourse";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="course" element={<CourseList />} />
                    <Route path="search" element={<Search />} />
                    <Route path="user" element={<YourProfile />} />
                    <Route path="userscourse" element={<YourCourse />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="courses" element={<CourseManagement />} />
                    <Route path="course/:id" element={<Course />} />
                </Route>
                <Route path="login" element={<Login />} />
                <Route path="*" element={<NoPage />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

