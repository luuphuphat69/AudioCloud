import React from 'react';

const NavbarLoggedOut = () => {
    const handleLogout = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
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
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {/* You may need to update the img src path */}
                                        <img src="../src/assets/img/user.png" width="45px" height="45px" className="rounded-circle" alt="User" />
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                        <a className="dropdown-item" href="#">Profile</a>
                                        <a className="dropdown-item" href="#">My workspace</a>
                                        <a className="dropdown-item" href="" onClick={handleLogout}>Log Out</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default NavbarLoggedOut;
