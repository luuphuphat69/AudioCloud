import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API requests
import { useLocation } from 'react-router-dom';
import NavbarLoggedIn from '../component/navbar/navbar_loggedin';
import NavbarLoggedOut from '../component/navbar/navbar_loggedout';
import Search_Tracks from '../component/search_tracks';
import Search_Playlists from '../component/search_playlists';

const Search = () => {
    const location = useLocation();
    const { searchResults } = location.state || { searchResults: [] };
    const {playlistResults} = location.state || {playlistResults: []};

    const [selectedOption, setSelectedOption] = useState('tracks');
    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };
    // Load nav bar
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://audiocloud.asia:8000/get-cookies', { withCredentials: true });
                const receivedToken = response.data;
                setToken(receivedToken);
                // Check the login status once the token is available
                checkLoginStatus();
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, [isLoggedIn]);
    const checkLoginStatus = () => {
        if (token) {
            setIsLoggedIn(true);
            console.log(isLoggedIn);
        } else {
            setIsLoggedIn(false);
            console.log(isLoggedIn);
        }
    };

    return (
        <section className="cart_area padding_top">
            {isLoggedIn ? <NavbarLoggedIn /> : <NavbarLoggedOut />}
            <div className="container">
                <div className='row'>
                    <div className='col-lg-2' style={{ right: "100px" }}>
                        <div className="sidebar">
                            <h5>Kết quả tìm kiếm:</h5>
                            <ul>
                                <li>
                                    <div
                                        style={{
                                            backgroundColor: selectedOption === 'tracks' ? "#000" : "transparent",
                                            color: selectedOption === 'tracks' ? "#FFF" : "#000",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleOptionClick('tracks')}
                                    >
                                        Bài hát
                                    </div>
                                </li>
                                <li>
                                    <div
                                        style={{
                                            backgroundColor: selectedOption === 'playlists' ? "#000" : "transparent",
                                            color: selectedOption === 'playlists' ? "#FFF" : "#000",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleOptionClick('playlists')}
                                    >
                                        Playlist
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='col'>
                       {selectedOption === 'tracks' ? <Search_Tracks searchResults={searchResults} /> : <Search_Playlists playlistResults={playlistResults}/>}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Search;