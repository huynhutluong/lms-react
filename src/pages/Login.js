import "../style/Login.css";
import React, {useLayoutEffect} from 'react'

const Login = () => {
    useLayoutEffect(() => {
        document.body.style.background = "linear-gradient(lightskyblue, white) fixed"
    });

    return <div className="login-page" >
                <div className="login-page-2">
                    <div className="login-title">
                        <h4>Hệ thống LMS</h4>
                        <h4>Trường CNTT&TT</h4>
                        <h4>Đại học Cần Thơ</h4>
                        <h4>____oOo____</h4>
                    </div>
                    <div className="login-logo">
                        <img src='/ctu-logo.png' alt="LOGO" width="80px" height="80px"/>
                    </div>
                    <form className="login-form" action="/">
                        <div className="login-input">
                            <input type="text" name="Tài khoản" id="username" placeholder="Tài khoản"/>
                        </div>
                        <div className="login-input">
                            <input type="pasword" name="Mật khẩu" id="password" placeholder="Mật khẩu"/>
                        </div>
                        <div className="login-input remember">
                            <input type="checkbox" name="remember" id="remember"/>
                            <label htmlFor="remember">Hiển thị mật khẩu</label>
                        </div>
                        <button className="login-input login-btn btn">Đăng nhập</button>
                    </form>
                </div>
    </div>;
};

export default Login;