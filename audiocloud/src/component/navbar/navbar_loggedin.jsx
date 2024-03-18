import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';

const NavbarLoggedIn = () => {

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' })
    
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Create a history object for navigation

    // Logout, delete cookie
    const handleLogOut = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.audiocloud.asia";
        window.location.href = '/home';
    }
    
    // Function to handle the search
    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            const response = await axios.get(`http://audiocloud.asia:8000/v1/audio/search?queries=${searchTerm}`);
            const response2 = await axios.get(`http://audiocloud.asia:8000/v1/playlist/search?queries=${searchTerm}`);
            console.log(response2.data);
            // Redirect to the search page with search results as a URL parameter
            // Navigate to the /search page with response data as a prop
            navigate('/search', {  state: {
                searchResults: response.data,
                playlistResults: response2.data,
            }, });
        } catch (error) {
            console.error(error);
        }
    }
    if(isDesktopOrLaptop){
        return (
            <header>
                <div className="header-area header-transparent">
                    <div className="main-header">
                        <nav className="navbar navbar-expand-lg ftco-navbar-light bg-light" id="ftco-navbar">
                            <div className="container">
                                <div>
                                    <img src="../src/assets/img/logo_main.png" style={{ width: '25%', height: '25%' }} alt="Logo" />
                                    <Link className="navbar-brand" to="/home">Audio Cloud <span>spacespeaking.inc</span></Link>
                                </div>
                                <div className="collapse navbar-collapse" id="ftco-nav">
                                    <ul className="navbar-nav m-auto">
                                        <li className="nav-item">
                                            <Link to="/home" className="nav-link">Trang chủ</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/profile" className="nav-link">Thư viện</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/subcription" className="nav-link">Dịch vụ</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/upload" className="nav-link">Đăng tải</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <form className="searchform order-sm-start order-lg-last" onSubmit={handleSearch}>
                                    <div className="form-group d-flex">
                                        <input type="text"
                                            className="form-control pl-3"
                                            style={{ width: '300px' }}
                                            placeholder="Tìm kiếm"
                                            name="searchinput"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)} />
                                    </div>
                                </form>
                            </div>
                            <div className="collapse navbar-collapse" id="navbar-list-4" style={{ marginRight: '90px' }}>
                                <ul className="navbar-nav" id="navbar-links">
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img src="../src/assets/img/user.png" width="45px" height="45px" className="rounded-circle" alt="User" />
                                        </a>
                                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                            <Link className="dropdown-item" to="/profile">Tài khoản</Link>
                                            <Link className="dropdown-item" onClick={handleLogOut}>Đăng xuất</Link>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }else if(isTabletOrMobile){
        return (
            <header>
                <div className="header-area header-transparent">
                    <div className="main-header">
                        <nav className="navbar navbar-expand-lg ftco-navbar-light bg-light" id="ftco-navbar">
                            <div className="container">
                                <div>
                                    <img src="../src/assets/img/logo_main.png" style={{ width: '25%', height: '25%' }} alt="Logo" />
                                    <Link className="navbar-brand" to="/home">Audio Cloud <span>spacespeaking.inc</span></Link>
                                </div>
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#ftco-nav"
                                >
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <form className="searchform" onSubmit={handleSearch}>
                                    <div className="form-group d-flex">
                                        <input
                                            type="text"
                                            className="form-control pl-3"
                                            style={{ width: '300px' }}
                                            placeholder="Tìm kiếm"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <button
                                            className="navbar-toggler user-toggler ml-2"
                                            type="button"
                                            data-toggle="collapse"
                                            data-target="#user-menu">
                                            <img src="../src/assets/img/user.png" width="45px" height="45px" className="rounded-circle" alt="User" />
                                        </button>
                                    </div>
                                </form>
                                <div className="collapse navbar-collapse" id="user-menu" style={{top:"0px", marginTop:"15px"}}>
                                    <ul className="navbar-nav" id="navbar-links">
                                        <li className="nav-item dropdown">
                                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                                <Link className="dropdown-item" to="/profile">Tài khoản</Link>
                                                <Link to="/subcription" className="dropdown-item">Dịch vụ</Link>
                                                <Link to="/upload" className="dropdown-item">Đăng tải</Link>
                                                <Link className="dropdown-item" onClick={handleLogOut}>Đăng xuất</Link>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
};

export default NavbarLoggedIn;
