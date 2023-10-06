import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory from React Router
import axios from 'axios';

const NavbarLoggedIn = () => {
    // Logout, delete cookie
    const handleLogOut = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Create a history object for navigation
    // Function to handle the search
    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            const response = await axios.get(`http://localhost:8000/v1/audio/search?queries=${searchTerm}`);
            // Redirect to the search page with search results as a URL parameter
            // Navigate to the /search page with response data as a prop
            navigate('/search', { state: { searchResults: response.data } });
        } catch (error) {
            console.error(error);
        }
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
                            <form className="searchform order-sm-start order-lg-last" onSubmit={handleSearch}>
                                <div className="form-group d-flex">
                                    <input type="text"
                                        className="form-control pl-3"
                                        style={{ width: '300px' }}
                                        placeholder="Search"
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
                                        <a className="dropdown-item" href="#">Profile</a>
                                        <a className="dropdown-item" href="#">My workspace</a>
                                        <a className="dropdown-item" href="" onClick={handleLogOut}>Log Out</a>
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

export default NavbarLoggedIn;
