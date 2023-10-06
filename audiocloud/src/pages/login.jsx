import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Navbar from '../component/navbar';
axios.defaults.withCredentials = true;


const Login = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const account = document.getElementById('account').value;
        const password = document.getElementById('password').value;

        try {
            // Send a POST request to your login API
            const apiData = await fetch("http://localhost:8000/v1/user/login", {
                method: "POST",
                body: JSON.stringify({ Account: account, Password: password }),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Handle the API response
            if (apiData.status === 200) {
                // Handle successful login here, e.g., store the token and redirect the user.
                console.log('Login successfully');
                window.alert('Login successfully'); // Display a success alert
                window.location.href = '/home';
            } else if (apiData.status === 401) {
                const errorMessage = await apiData.json();
                window.alert(errorMessage.message); // Display an error alert
            }
        } catch (error) {
            console.error('An error occurred:', error);
            window.alert('An error occurred. Please try again later.'); // Display an error alert
        }
    };

    useEffect(() => {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', handleSubmit);

        return () => {
            loginForm.removeEventListener('submit', handleSubmit);
        };
    }, []);

    return (
        <body className="custom_container">
             <Navbar />
            <div className="mycontainer">
                <div className="signup-content">
                    <form method="POST" id="login-form" className="signin-form">
                        <h2 className="textH2">Sign In </h2>
                        <div className="form-group">
                            <input type="text" className="form-input" name="name" id="account" placeholder="Your Account" />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-input" name="password" id="password" placeholder="Password" />
                            <span toggle="#password" className="zmdi zmdi-eye field-icon toggle-password"></span>
                            <a className="forgot-password" href=''>Forgot password ?</a>
                        </div>
                        <div className="separator textColor">Or</div>
                        <div className='icon_login'>
                            <img src='../src/assets/img/facebook.png' className='icon' />
                            <img src='../src/assets/img/google_pic.png' className='icon' />
                            <img src='../src/assets/img/instagram.png' className='icon' />
                        </div>
                        <div className="form-group d-flex justify-content-between">
                            <button
                                type="submit"
                                name="submit"
                                id="submit"
                                value="Sign up"
                                className="btn-61">
                                <span>Sign In</span>
                            </button>
                            <a href="/register" className="submit-link submit">Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
        </body>
    );
}
export default Login