import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../component/navbar/navbar';
axios.defaults.withCredentials = true;
import { useMediaQuery } from 'react-responsive';

const Login = () => {

    const navigate = useNavigate();
    const [account, setAccount] = useState('');
    const [validationMessage, setValidationMessage] = useState('');

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' })

    const handleAccountChange = (e) => {
        setAccount(e.target.value);
        // Check for special symbols in the account input
        const hasSpecialSymbol = /[^a-zA-Z0-9]/.test(e.target.value);
        setValidationMessage(hasSpecialSymbol ? 'Tài khoản không được chứa ký tự đặc biệt' : '');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const account = document.getElementById('account').value;
        const password = document.getElementById('password').value;

        if (validationMessage) {
            window.alert(validationMessage);
            return;
        }

        try {
            // Send a POST request to your login API
            const apiData = await fetch("http://audiocloud.asia:8000/v1/user/login", {
                method: "POST",
                body: JSON.stringify({ Account: account, Password: password }),
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Handle the API response
            if (apiData.status === 201) {
                // Handle successful login here, e.g., store the token and redirect the user.
                window.alert('Login successfully'); // Display a success alert
                navigate('/home');
            } else if (apiData.status === 401) {
                const errorMessage = await apiData.json();
                window.alert(errorMessage.message); // Display an error alert
            }
        } catch (error) {
            console.error('An error occurred:', error);
            window.alert('An error occurred. Please try again later.'); // Display an error alert
        }
    };

    if (isDesktopOrLaptop) {

        return (
            <body className="custom_container">
                <Navbar />
                <div className="signup-content" style={{ backgroundColor: '#FFA33C' }}>
                    <form method="POST" id="login-form" className="signin-form" onSubmit={handleSubmit}>
                        <h2 className="textH2">Đăng nhập</h2>
                        <div className="form-group">
                            <label htmlFor="account" style={{ color: "#000" }}>Tài khoản</label>
                            <input type="text" className="form-input" name="name" id="account" placeholder="Tài khoản" value={account}
                                onChange={handleAccountChange} />
                            {validationMessage && <span className="validation-message alert-danger">{validationMessage}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" style={{ color: "#000" }}>Mật khẩu</label>
                            <input type="password" className="form-input" name="password" id="password" placeholder="Mật khẩu" />
                            <span toggle="#password" className="zmdi zmdi-eye field-icon toggle-password"></span>
                            <a className="forgot-password" href=''>Quên mật khẩu ?</a>
                        </div>
                        {/* <div className="separator textColor">Hoặc</div>
                    <div style={{ display: 'flex', justifyContent: "center" }}>
                        <img src='../src/assets/img/facebook.png' className='icon' alt="Facebook" />
                        <img src='../src/assets/img/google_pic.png' className='icon' alt="Google" />
                        <img src='../src/assets/img/instagram.png' className='icon' alt="Instagram" />
                    </div> */}
                        <div style={{ display: 'flex', justifyContent: "center" }}>
                            <button
                                type="submit"
                                name="submit"
                                id="submit"
                                value="Sign up"
                                className="btn-61">
                                <span style={{ fontFamily: 'inherit' }}>Đăng nhập</span>
                            </button>
                        </div>
                    </form>
                </div>
            </body>
        );
    } else if (isTabletOrMobile) {
        return (
            <body className="custom_container">
                <Navbar />
                <div className="signup-content mr-2" style={{ backgroundColor: '#FFA33C' }}>
                    <form method="POST" id="login-form" className="signin-form" onSubmit={handleSubmit}>
                        <h2 className="textH2">Đăng nhập</h2>
                        <div className="form-group">
                            <label htmlFor="account" style={{ color: "#000" }}>Tài khoản</label>
                            <input type="text" className="form-input" name="name" id="account" placeholder="Tài khoản" value={account}
                                onChange={handleAccountChange} />
                        </div>
                         {validationMessage && <span className="validation-message alert-danger">{validationMessage}</span>}
                        <div className="form-group">
                            <label htmlFor="password" style={{ color: "#000" }}>Mật khẩu</label>
                            <input type="password" className="form-input" name="password" id="password" placeholder="Mật khẩu" />
                            <span toggle="#password" className="zmdi zmdi-eye field-icon toggle-password"></span>
                            <a className="forgot-password" href=''>Quên mật khẩu ?</a>
                        </div>
                        <div className='ml-3' style={{ display: 'flex', justifyContent: "center" }}>
                            <button
                                type="submit"
                                name="submit"
                                id="submit"
                                value="Sign up"
                                className="btn-61">
                                <span style={{ fontFamily: 'inherit' }}>Đăng nhập</span>
                            </button>
                        </div>
                    </form>
                </div>
            </body>
        );
    }
}
export default Login;