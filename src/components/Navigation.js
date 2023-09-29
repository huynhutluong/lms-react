import {Link} from "react-router-dom";
import Clock from "./Clock";

function Navigation() {
    return (
        <div className="Navigation">
            <div className="header-logo center-column">
                <img src='/ctu-logo.png' alt="LOGO" width="40px" height="40px"/>
                <div style={{ fontSize:"small" }}>
                    <b >ĐỒNG THUẬN - TẬN TÂM</b>
                    <br/>
                    <b>CHUẨN MỰC - SÁNG TẠO</b>
                    <hr/>
                </div>
            </div>
            <Clock />
            <Link to="/" className="nav-link">
                <img src='/home.png' alt="home" width="20px" height="20px" />
                <b>Trang chủ</b>
            </Link>
            <Link to="/user" className="nav-link">
                <img src='/student.png' alt="user" width="20px" height="20px" />
                <b>Trang cá nhân</b>
            </Link>
            <Link to="/course" className="nav-link">
                <img src='/online-learning.png' alt="course" width="20px" height="20px" />
                <b>Danh sách khóa học</b>
            </Link>
            <Link to="/userscourse" className="nav-link">
                <img src='/homework.png' alt="yourcouse" width="20px" height="20px" />
                <b>Các khóa học của bạn</b>
            </Link>
            <Link to="/users" className="nav-link">
                <img src='/homework.png' alt="users" width="20px" height="20px" />
                <b>Quản lý người dùng</b>
            </Link>
            <Link to="/courses" className="nav-link">
                <img src='/homework.png' alt="courses" width="20px" height="20px" />
                <b>Quản lý khóa học</b>
            </Link>
            <Link to="/login" className="nav-link">
                <img src='/back.png' alt="login" width="20px" height="20px" />
                <b>Đăng xuất</b>
            </Link>
        </div>
    );
}

export default Navigation;