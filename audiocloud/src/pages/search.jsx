import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API requests
import { useLocation } from 'react-router-dom';
import NavbarLoggedIn from '../component/navbar_loggedin';
import NavbarLoggedOut from '../component/navbar_loggedout';
import {useAPlayer } from '../component/player_context';

const Search = () => {
    const location = useLocation();
    const { searchResults } = location.state || { searchResults: [] };

    const [data, setData] = useState(searchResults); // Initialize with searchResults
    const [audio, setAudio] = useState([]);

    // Load nav bar
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getcookie', { withCredentials: true });
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

    // Handle button clicked
    const handleClick = async (audioURL, audioname, artist, coverImg) => {
        const newAudio = ([{
            AudioName: audioname,
            UserDisplayname: artist,
            AudioURL: audioURL,
            PhotoURL: coverImg
          }]);
          setAudio(newAudio);
          console.log(audio);   
    }

    // Init player
    const {initializeAPlayer}  = useAPlayer();
    useEffect(() => {
        if (audio) {
            initializeAPlayer(audio);
        }
    }, [audio]);

    useEffect(() => {
        // Update the data state when searchResults prop changes
        setData(searchResults);
      }, [searchResults]);

    return (
        <section className="cart_area padding_top">
            {isLoggedIn ? <NavbarLoggedIn /> : <NavbarLoggedOut />}
            <div className="container">

                {data.map((item) => (
                    <div class="d-block d-md-flex podcast-entry bg-white mb-5" data-aos="fade-up">
                        <div className="image-container">
                            {item.PhotoURL ? (
                                <img src={item.PhotoURL} style={{ width: '170px', height: '160px' }} alt="" />
                            ) : (
                                <img style={{ width: '170px', height: '160px' }} src="./src/assets/img/blur_img.png" alt="Default" />
                            )}
                            <div className="center-button">
                                <button className="btn-95" onClick={() => handleClick(item.AudioURL, item.AudioName, item.UserDisplayname, item.PhotoURL)}>
                                    <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
                                        <g>
                                            <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="text">
                            <h3 class="font-weight-light ml-3"><a href="single-post.html">{item.AudioName}</a></h3>
                            <p class="mb-4 ml-3">{item.UserDisplayname}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Search;