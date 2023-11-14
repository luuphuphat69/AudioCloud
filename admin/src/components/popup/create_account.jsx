import axios from "axios";
import React, { useState, useEffect } from "react";
import Notication from '../notify';

const CreateAccount = ({ closePopup }) => {

    const [role, setRole] = useState(null);
    const [notify, setNotify] = useState(false);

    const [Account, setAccount] = useState('');
    const [Email, setEmail] = useState('');
    const [Pass, setPassword] = useState(''); 

    const [AccountValidation, setAccountValidation] = useState('');
    const [EmailValidation, setEmailValidation] = useState('');
    const [PassValidation, setPassValidation] = useState('');   

    const popupFormStyle = {
        background: '#F0F0F0',
        width: '1000px', // Adjust the width as needed
        height: '80vh', // Adjust the height as needed
        display: 'flex',
        alignItems: 'center', // Vertical centering
        justifyContent: 'center', // Horizontal centering
        flexDirection: 'column', // Stack children vertically
        marginLeft: "240px"
    };

    const wrapperStyle = {
        width: '100%', // Ensure the content width is 100% within the container
        maxWidth: '1000px', // Limit the maximum width of the form content
    };

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

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const handleClose = () => {
        setNotify(false);
    }

    const handleCreateAccount = async () => {

        if(AccountValidation || EmailValidation || PassValidation){
            window.alert('Đăng ký không thành công. Hãy thử lại');
        }

        // If the passwords match, you can proceed with form submission logic
        const account = document.getElementById('account').value;
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
        const userRole = role;

        const formData = new URLSearchParams();
        formData.append('Account', account);
        formData.append('Password', password);
        formData.append('Email', email);
        formData.append('Role', userRole);
        
        try {
            const response = await axios.post('http://audiocloud.asia:8000/v1/user/create-account', formData, {
                method:'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            if (response.status === 201) {
                setNotify(true);
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with an error status
                console.error('Error response:', error.response.data);
                const errorMessage = error.response.data.message;
    
                // Check if the error message contains information about existing email
                if (errorMessage.includes('Account or Email already exists')) {
                    window.alert('Tài khoản hoặc Email đã tồn tại. Hãy thử lại khác.');
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
    }

    return (
        <div className="overlay" onClick={closePopup}>
            {notify ? <Notication type='success' message='Tạo tài khoản thành công' onClose={handleClose}/> : null}
            <div className="popup-form" style={popupFormStyle}>
                <div style={wrapperStyle}>
                    <h2 className="mb-4 text-center">Tạo tài khoản</h2>
                    <form className="border border-3 p-4" method="POST" onClick={(e) => {
                        e.stopPropagation(); // Prevent click event from propagating to the outer div
                    }}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Tài khoản</label>
                                <input
                                    type="text"
                                    id='account'
                                    className="form-control border"
                                    onChange={handleAccountChange}
                                    placeholder="Nhập vào Tên hiển thị" required />
                                {AccountValidation && <span className="validation-message alert-danger" style={{color:'#fff'}}>Tài khoản không được chứa ký tự đặc biệt</span>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Mật khẩu</label>
                                <input
                                    className="form-control border"
                                    id="password"
                                    onChange={handlePasswordChange}
                                    placeholder="Nhập vào Mật khẩu"></input>
                                {PassValidation &&  <span className="validation-message alert-danger" style={{color:'#fff'}}>Mật khẩu phải có ít nhất 6 ký tự.</span>}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="text"
                                    id='email'
                                    className="form-control border"
                                    onChange={handleEmailChange}
                                    placeholder='Nhập vào email' required />
                                {EmailValidation && <span className="validation-message alert-danger" style={{color:'#fff'}}>Email không hợp lệ. Hãy nhập đúng định dạng email.</span>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="roleSelect">
                                    Vai trò
                                </label>
                                <select
                                    className="form-select border"
                                    id="role"
                                    onChange={handleRoleChange}
                                    required>
                                    <option value="User">Người dùng</option>
                                    <option value="Admin">Quản trị viên</option>
                                </select>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-primary btn-lg" type="button" onClick={handleCreateAccount}>
                                Tạo tài khoản
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}
export default CreateAccount;