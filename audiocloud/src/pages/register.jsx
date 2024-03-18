import axios, { formToJSON } from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../component/navbar/navbar';
import { useMediaQuery } from 'react-responsive';

const Register = () => {

    const [Account, setAccount] = useState('');
    const [Email, setEmail] = useState('');
    const [Pass, setPassword] = useState('');   

    const [AccountValidation, setAccountValidation] = useState('');
    const [EmailValidation, setEmailValidation] = useState('');
    const [RepassValidation, setRepassValidation] = useState('');
    const [PassValidation, setPassValidation] = useState('');   

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' })

    const navigate = useNavigate();

    const handleAccountChange = (e) => {
        setAccount(e.target.value);
        // Check for special symbols in the account input
        const hasSpecialSymbol = /[^a-zA-Z0-9]/.test(e.target.value);
        setAccountValidation(hasSpecialSymbol ? 'Tài khoản không được chứa ký tự đặc biệt' : '');
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Add email validation logic if needed
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
        setEmailValidation(isValidEmail ? '' : 'Email không hợp lệ. Hãy nhập đúng định dạng email.');
    };
    
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        // Add password validation logic if needed
        const isValidPassword = e.target.value.length >= 6;
        setPassValidation(isValidPassword ? '' : 'Mật khẩu phải có ít nhất 6 ký tự.');
    };
    
    const handleRepasswordChange = (e) => {
        // Check if repassword matches password
        const passwordsMatch = e.target.value === Pass;
        setRepassValidation(passwordsMatch ? '' : 'Mật khẩu không khớp.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(AccountValidation || EmailValidation || PassValidation || RepassValidation){
            window.alert('Đăng ký không thành công. Hãy thử lại');
        }
        // If the passwords match, you can proceed with form submission logic
        const account = document.getElementById('account').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;

        const formData = new URLSearchParams();
        formData.append('Account', account);
        formData.append('Password', password);
        formData.append('Email', email);
        
        try {
            const response = await axios.post('http://audiocloud.asia:8000/v1/user/register', formData, {
                method:'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            if (response.status === 201) {
                window.alert('Đăng ký thành công');
                navigate('/login');
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with an error status
                console.error('Error response:', error.response.data);
                const errorMessage = error.response.data.message;
    
                // Check if the error message contains information about existing email
                if (errorMessage.includes('Email already exists')) {
                    window.alert('Email đã tồn tại. Hãy sử dụng email khác.');
                } else {
                    window.alert('Đăng ký không thành công. Hãy thử lại.');
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error during request setup:', error.message);
            }
        }
    };
    if(isDesktopOrLaptop){
        return (
            <body className="custom_container">
                <div>
                    <Navbar />
                </div>
                <div className="signup-content" style={{ backgroundColor: '#FFA33C' }}>
                    <form method="POST" id="signup-form" className="signup-form" onSubmit={handleSubmit}>
                        <h2 className="textH2">Đăng ký</h2>
                        <div className="form-group">
                            <label htmlFor="account" style={{ color: "#000" }}>Tài khoản</label>
                            <input
                                id='account'
                                type="text"
                                className="form-input"
                                name="name"
                                onChange={handleAccountChange}
                                placeholder="Tài khoản"
                                style={{color:'#000'}}
                            />
                            {AccountValidation && <span className="validation-message alert-danger">Tài khoản không được chứa ký tự đặc biệt</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" style={{ color: "#000" }}>Mật khẩu</label>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                name="password"
                                onChange={handlePasswordChange}
                                placeholder="Mật khẩu"
                                style={{color:'#000'}}
                            />
                            <span toggle="#password" className="zmdi zmdi-eye field-icon toggle-password"></span>
                            {PassValidation &&  <span className="validation-message alert-danger">Mật khẩu phải có ít nhất 6 ký tự.</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="repassword" style={{ color: "#000" }}>Nhập lại mật khẩu</label>
                            <input
                                type="password"
                                className="form-input"
                                name="repassword"
                                onChange={handleRepasswordChange}
                                placeholder="Nhập lại mật khẩu"
                                style={{color:'#000'}}
                            />
                            <span toggle="#password" className="zmdi zmdi-eye field-icon toggle-password"></span>
                            {RepassValidation && <span className="validation-message alert-danger">Mật khẩu không khớp.</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" style={{ color: "#000" }}>Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-input"
                                name="email"
                                onChange={handleEmailChange}
                                placeholder="Email"
                                style={{color:'#000'}}
                            />
                            {EmailValidation && <span className="validation-message alert-danger">Email không hợp lệ. Hãy nhập đúng định dạng email.</span>}
                        </div>
                        {/* Other form elements */}
                        <div className="form-group" style={{ display: 'flex', justifyContent: "center" }}>
                            <button
                                type="submit"
                                name="submit"
                                id="submit"
                                value="Sign up"
                                className="btn-61">
                                <span>Đăng ký</span>
                            </button>
                        </div>
                    </form>
                </div>
            </body>
        );
        
    }else if(isTabletOrMobile){
        return (
            <body className="custom_container">
                <div>
                    <Navbar />
                </div>
                <div className="signup-content mr-3" style={{ backgroundColor: '#FFA33C', marginTop:'100px' }}>
                    <form method="POST" id="signup-form" className="signup-form" onSubmit={handleSubmit}>
                        <h2 className="textH2">Đăng ký</h2>
                        <div className="form-group">
                            <label htmlFor="account" style={{ color: "#000" }}>Tài khoản</label>
                            <input
                                id='account'
                                type="text"
                                className="form-input"
                                name="name"
                                onChange={handleAccountChange}
                                placeholder="Tài khoản"
                                required
                            />
                            {AccountValidation && <span className="validation-message alert-danger">Tài khoản không được chứa ký tự đặc biệt</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" style={{ color: "#000" }}>Mật khẩu</label>
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                name="password"
                                onChange={handlePasswordChange}
                                placeholder="Mật khẩu"
                                required
                            />
                            <span toggle="#password" className="zmdi zmdi-eye field-icon toggle-password"></span>
                            {PassValidation &&  <span className="validation-message alert-danger">Mật khẩu phải có ít nhất 6 ký tự.</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="repassword" style={{ color: "#000" }}>Nhập lại mật khẩu</label>
                            <input
                                type="password"
                                className="form-input"
                                name="repassword"
                                onChange={handleRepasswordChange}
                                placeholder="Nhập lại mật khẩu"
                            />
                            <span toggle="#password" className="zmdi zmdi-eye field-icon toggle-password"></span>
                            {RepassValidation && <span className="validation-message alert-danger">Mật khẩu không khớp.</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" style={{ color: "#000" }}>Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-input"
                                name="email"
                                onChange={handleEmailChange}
                                placeholder="Email"
                                required
                            />
                            {EmailValidation && <span className="validation-message alert-danger">Email không hợp lệ. Hãy nhập đúng định dạng email.</span>}
                        </div>
                        {/* Other form elements */}
                        <div className="form-group" style={{ display: 'flex', justifyContent: "center" }}>
                            <button
                                type="submit"
                                name="submit"
                                id="submit"
                                value="Sign up"
                                className="btn-61">
                                <span>Đăng ký</span>
                            </button>
                        </div>
                    </form>
                </div>
            </body>
        );
    }
};

export default Register;