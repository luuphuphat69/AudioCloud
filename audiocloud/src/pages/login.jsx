import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Login = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const account = document.getElementById('account').value;
        const password = document.getElementById('password').value;

        try {
            const response = await axios.post('http://localhost:8000/v1/user/login', {
                Account: account,
                Password: password,
            });

            if (response.status === 200) {
                // Handle successful login here, e.g., store the token and redirect the user.
                console.log('Login successfully');
                window.alert('Login successfully'); // Display a success alert
            } else if(response.status === 401) {
                const errorMessage = response.data.message
                window.alert(errorMessage); // Display an error alert
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
        <div class="mycontainer">
            <div class="signup-content">
                <form method="POST" id="login-form" class="signin-form">
                    <h2 class="textH2">Sign In </h2>
                    <div class="form-group">
                        <input type="text" class="form-input" name="name" id="account" placeholder="Your Account" />
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-input" name="password" id="password" placeholder="Password" />
                        <span toggle="#password" class="zmdi zmdi-eye field-icon toggle-password"></span>
                        <p class='textAlign'>Forgor password?</p>
                    </div>
                    <div class="separator textColor">Or</div>
                    <div>
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
                        <a href="register" class="submit-link submit">Sign Up</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login