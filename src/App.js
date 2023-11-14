import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { ProtectedLayout } from "./pages/ProtectedLayout";
import LoginLayout from "./pages/LoginLayout";
import Course from "./pages/Course";
import CourseUnsigned from "./pages/CourseUnsigned";
import CourseList from "./pages/CourseList";
import NoPage from "./pages/NoPage";
import YourCourse from "./pages/YourCourse";
import YourProfile from "./pages/YourProfile";
import Test from "./pages/Test";
import AdminCourse from "./pages/AdminCourse";
import InsertSectionContent from "./pages/InsertSectionContent";
import TestResult from "./pages/TestResult";
import TestConfirm from "./pages/TestConfirm";

export default function App() {
    return (
        <Routes>
            <Route element={<ProtectedLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/class/:id" element={<Course />} />
                <Route path="/aclass/:id" element={<AdminCourse />} />
                <Route path="/uclass/:id" element={<CourseUnsigned />} />
                <Route path="/test/:id" element={<Test />} />
                <Route path="/testconfirm/:id" element={<TestConfirm />} />
                <Route path="/course" element={<CourseList />} />
                <Route path="/ucourse" element={<YourCourse />} />
                <Route path="/user" element={<YourProfile />} />
                <Route path="/content/insert/:id" element={<InsertSectionContent />} />
                <Route path="/testresult/:id" element={<TestResult />} />
            </Route>

            <Route element={<LoginLayout />}>
                <Route path="/login" element={<Login />} />
            </Route>
            <Route path="*" element={<NoPage />} />
        </Routes>
    );
}