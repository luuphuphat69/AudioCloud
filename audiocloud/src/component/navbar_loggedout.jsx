import React from 'react';

const NavbarLoggedIn = () => {
    return (
        <header>
            <div className="header-area header-transparent">
                <div className="main-header">
                    <nav className="navbar navbar-expand-lg ftco-navbar-light bg-light" id="ftco-navbar">
                        <div className="container">
                            <div>
                                <img src="./src/assets/img/logo_main.png" style={{ width: '25%', height: '25%' }} alt="Logo" />
                                <a className="navbar-brand" href="/home">Audio Cloud <span>spacespeaking.inc</span></a>
                            </div>
                            <div className="collapse navbar-collapse" id="ftco-nav">
                                <ul className="navbar-nav m-auto">
                                    <li className="nav-item"><a href="/home" className="nav-link">Home</a></li>
                                    <li className="nav-item"><a href="#" className="nav-link">Library</a></li>
                                    <li className="nav-item"><a href="#" className="nav-link">Subscription</a></li>
                                    <li className="nav-item"><a href="#" className="nav-link">Upload</a></li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <form action="#" className="searchform order-sm-start order-lg-last">
                                <div className="form-group d-flex">
                                    <input type="text" className="form-control pl-3" style={{ width: '300px' }} placeholder="Search"/>
                                </div>
                            </form>
                        </div>
                        <div className="collapse navbar-collapse" id="navbar-list-4" style={{ marginRight: '90px' }}>
                            <ul className="navbar-nav" id="navbar-links">
                                <li className="nav-item" id="navbar-login">
                                    <a className="nav-link" href="/login" role="button">Login</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/register" role="button">SignUp</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default NavbarLoggedIn;