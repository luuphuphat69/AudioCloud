import axios from 'axios';
import React, { useState } from 'react';
import Navbar from '../component/navbar/navbar';
const Register = () => {

    const validateInput = (input) => {
        // Define a regular expression to allow only specific characters (e.g., A-Z, a-z, 0-9, and common symbols)
        const regex = /^[A-Za-z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/ \-]+$/;
      
        return regex.test(input);
      };

    const [formData, setFormData] = useState({
        name: '',
        password: '',
        repassword: '',
        email: '',
        passwordMatchError: false, // State to track password matching error
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const isValidInput = validateInput(value);
        setFormData({
            ...formData,
            [name]: isValidInput ? value : '',
            passwordMatchError: false, // Reset the password matching error when inputs change
        });
        if (!isValidInput) {
            // Show an error message to the user (you can use state or a separate element for this)
            window.alert('Phát hiện ký tự không hợp lệ. Xin nhập vào ký tự không có dấu');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the password and repassword match
        if (formData.password !== formData.repassword) {
            setFormData({
                ...formData,
                passwordMatchError: true, // Set password matching error to true
            });
            return; // Exit the function to prevent form submission
        }

        // If the passwords match, you can proceed with form submission logic
        const account = formData.name;
        const password = formData.password;
        const email = formData.email;
        try {
            const response = await axios.post('http://54.206.75.221:8000/v1/user/register', {
                Account: account,
                Password: password,
                Email: email,
            });
            if (response.status === 201) {
                window.alert('Đăng ký thành công');
            } else {
                window.alert('Email hoặc tài khoản đã tồn tại. Hãy thử lại');
            }
        } catch (error) {
            window.alert('Email hoặc tài khoản đã tồn tại. Hãy thử lại');
            console.error('An error occurred:', error);
        }

        // Reset the form data after successful submission
        setFormData({
            name: '',
            password: '',
            repassword: '',
            email: '',
            passwordMatchError: false,
        });
    };

    return (
        <body class="custom_container">
            <div>
                <Navbar />
            </div>
                <div className="signup-content">
                    <form method="POST" id="signup-form" className="signup-form" onSubmit={handleSubmit}>
                        <h2 className="textH2">Đăng ký</h2>
                        <div className="form-group">
                            <input
                                id='account'
                                type="text"
                                className="form-input"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Tài khoản"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Mật khẩu"
                            />
                            <span toggle="#password" className="zmdi zmdi-eye field-icon toggle-password"></span>
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-input"
                                name="repassword"
                                value={formData.repassword}
                                onChange={handleInputChange}
                                placeholder="Nhập lại mật khẩu"
                            />
                            <span toggle="#password" className="zmdi zmdi-eye field-icon toggle-password"></span>
                        </div>
                        {formData.passwordMatchError && (
                            <div className="password-match-error text-error">Passwords do not match.</div>
                        )}
                        <div className="form-group">
                            <input
                                id="email"
                                type="text"
                                className="form-input"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                            />
                        </div>
                        <div className="separator textColor">Hoặc</div>
                        <div style={{display: 'flex', justifyContent:"center"}}>
                            <img src="../src/assets/img/facebook.png" className="icon" />
                            <img src="../src/assets/img/google_pic.png" className="icon" />
                            <img src="../src/assets/img/instagram.png" className="icon" />
                        </div>
                        <div className="form-group d-flex justify-content-between">
                            <button
                                type="submit"
                                name="submit"
                                id="submit"
                                value="Sign up"
                                className="btn-61">
                                <span>Đăng ký</span>
                            </button>
                            <a href="login" class="submit-link submit">Đăng nhập</a>
                        </div>
                    </form>
                </div>
        </body>
    );
};

export default Register;