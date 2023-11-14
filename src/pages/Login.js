import "../style/Login.css";
import React, {useEffect, useState} from 'react'
import {useAuth} from "../hooks/useAuth";
import {Input} from "semantic-ui-react";

const Login = () => {
    const {login} = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        await fetch(
            "http://localhost:8080/login",
            {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({
                    account_username: event.target[0].value,
                    account_password: event.target[1].value
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            })
            .then(res => res.json())
            .then(res => {
                login({
                    account_username: res.account_username,
                    token: res.token
                });
            })
            .catch(error => alert("Loi dang nhap"))
        // login({
        //     account_username: data.get("username"),
        //     account_password: data.get("password")
        // });
    };

    return <div className="login-page">
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
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-input ui input">
                    <Input type="text" name="account_username" id="account_username" placeholder="Tài khoản" required/>
                </div>
                <div className="login-input ui input">
                    <Input type="password" name="account_password" id="account_password" placeholder="Mật khẩu"/>
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