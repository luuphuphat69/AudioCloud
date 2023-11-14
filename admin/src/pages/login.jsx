import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import SideBar from '../components/sidebar';
const Login = () => {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const account = document.getElementById('account').value;
        const password = document.getElementById('password').value;

        try {
            const response = await axios.post('http://audiocloud.asia:8000/v1/user/login', {
                Account: account,
                Password: password,
            });
            const token = response.data;
            const  user = jwtDecode(token);
            if (response.status === 201 && user.role === 'Admin') {
                // Handle successful login here, e.g., store the token and redirect the user.
                window.alert('Đăng nhập thành công'); // Display a success alert
                navigate('/user-management');
            }else if(response.status === 201 && user.role === 'User'){
                window.alert("Không thể đăng nhập bằng tài khoảng người dùng");
            } else if (response.status === 401) {
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
        <main  className="main-content  mt-0">
            <div  className="page-header align-items-start min-vh-100 background">
                <span  className="mask bg-gradient-dark opacity-6"></span>
                <div  className="container my-auto">
                <SideBar/>
                    <div  className="row">
                        <div  className="col-lg-4 col-md-8 col-12 mx-auto">
                            <div  className="card z-index-0 fadeIn3 fadeInBottom">
                                <div  className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                    <div  className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                                        <h4  className="text-white font-weight-bolder text-center mt-2 mb-0">Sign in</h4>
                                    </div>
                                </div>
                                <div  className="card-body">
                                    <form id='login-form'  className="text-start">
                                        <div  className="input-group input-group-outline my-3">
                                            <input id='account'  className="form-control" placeholder='Account'/>
                                        </div>
                                        <div  className="input-group input-group-outline mb-3">
                                            <input id='password' type="password"  className="form-control" placeholder='Password'/>
                                        </div>
                                        <div  className="text-center">
                                            <button type="submit" id="submit" className="btn bg-gradient-primary w-100 my-4 mb-2">Sign in</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
export default Login;