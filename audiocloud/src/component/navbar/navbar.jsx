import React from 'react';
import { Link } from 'react-router-dom';
const Navbar = () => {
    return (
        <header>
            <div className="header-area header-transparent">
                <div className="main-header">
                    <nav className="navbar navbar-expand-lg ftco-navbar-light bg-light" id="ftco-navbar">
                        <div className="container">
                            <div>
                                <img src="./src/assets/img/logo_main.png" style={{ width: '25%', height: '25%' }} alt="Logo" />
                                <Link className="navbar-brand" to="/home">Audio Cloud <span>spacespeaking.inc</span></Link>
                            </div>
                            <div className="collapse navbar-collapse" id="ftco-nav">
                                <ul className="navbar-nav m-auto">
                                    <li className="nav-item"><Link to="/home" className="nav-link">Trang chủ</Link></li>
                                    <li className="nav-item"><Link to="/subcription" className="nav-link">Dịch vụ</Link></li>
                                </ul>
                                <ul className="navbar-nav">
                                    <li className="nav-item"><Link to="/login" className="nav-link">Đăng nhập</Link></li>
                                    <li className="nav-item"><Link to="/register" className="nav-link">Đăng ký</Link></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
