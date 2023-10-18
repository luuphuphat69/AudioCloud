import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API requests
import jwt from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import NavbarLoggedIn from '../component/navbar/navbar_loggedin';
import NavbarLoggedOut from '../component/navbar/navbar_loggedout';
import Notification from '../component/notify/notify_comp';
import { useAPlayer } from '../component/player_context';

const Search = () => {
    const location = useLocation();
    const { searchResults } = location.state || { searchResults: [] };

    const [data, setData] = useState(searchResults); // Initialize with searchResults
    const [audio, setAudio] = useState([]);
    const [userId, setUserId] = useState('');

    const [showNotification, setShowNotification] = useState(false);

    const handleLikeClick = () => {
        setShowNotification(true); // Show the notification
      };

    // Load nav bar
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getcookie', { withCredentials: true });
                const receivedToken = response.data;
                const user = jwt(receivedToken);
                setUserId(user.userId);
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

    useEffect(() => {
        try{
            console.log(userId);
        }catch(error){
            console.log(error);
        }
    }, [userId]);

    // Handle button clicked
    const handleClick = async (audioId, audioURL, audioname, artist, coverImg) => {
        const newAudio = ([{
            AudioId: audioId,
            AudioName: audioname,
            UserDisplayname: artist,
            AudioURL: audioURL,
            PhotoURL: coverImg
        }]);
        setAudio(newAudio);
        console.log(audio);
        updatePlays(audio[0].AudioId);
    }

    const handleLike = async (audioId) => {
        try{
            const response = await axios.put(`http://localhost:8000/v1/fav/add-to-fav/${audioId}/${userId}`);
            handleLikeClick();
        }catch(err){
            console.log(err);
        }
    }

    const updatePlays = async (audioId) => {
        try{
            const response = await axios.put(`http://localhost:8000/v1/audio/update-plays/${audioId}`);
            console.log(response.data);
        }catch(error){
            console.log(error);
        }
    }

    // Init player
    const { initializeAPlayer } = useAPlayer();
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
                    <div class="d-block d-md-flex podcast-entry mb-5" style={{backgroundColor: "#EDEDED"}}>
                        <div className="image-container p-3 mt-4">
                            {item.PhotoURL ? (
                                <img src={item.PhotoURL} style={{ width: '170px', height: '160px' }} alt="" />
                            ) : (
                                <img style={{ width: '170px', height: '160px' }} src="./src/assets/img/blur_img.png" alt="Default" />
                            )}
                            <div className="center-button">
                                <button className="btn-95 mb-5" onClick={() => handleClick(item.AudioId, item.AudioURL, item.AudioName, item.UserDisplayname, item.PhotoURL)}>
                                    <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
                                        <g>
                                            <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="text">
                            <h3 class="font-weight-light p-3"><a href="single-post.html">{item.AudioName}</a></h3>
                            <h5 class="font-weight-light mb-4 ml-3">
                                By: <a href='#'>{item.UserDisplayname}</a>
                            </h5>
                            <p className='ml-3'>Plays: {item.Plays}</p>
                            <div className='ml-3' style={{ display: 'flex' }}>
                                <button className='mr-3 mb-3' style={{ display: 'flex', alignItems: 'center' }} onClick={() => handleLike(item.AudioId)}>
                                    <div className='box'>
                                        <img className='mr-3 horizontal-button' src='../src/assets/img/icon/heart.png' style={{ width: "20px", height: "20px" }} />
                                    </div>
                                    <div className='box mt-3'>
                                        <p>Likes</p>
                                    </div>
                                </button>

                                <button className='mr-3 mb-3' style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className='box'>
                                        <img className='mr-3 horizontal-button' src='../src/assets/img/icon/playlist.png' style={{ width: "20px", height: "20px" }} />
                                    </div>
                                    <div className='box mt-3'>
                                        <p>Add to playlist</p>
                                    </div>
                                </button>

                                <button className='mr-3 mb-3' style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className='box'>
                                        <img className='mr-3 horizontal-button' src='../src/assets/img/icon/music-album.png' style={{ width: "30px", height: "30px" }} />
                                    </div>
                                    <div className='box mt-3'>
                                        <p>Add to album</p>
                                    </div>
                                </button>

                                <button className='mr-3 mb-3' style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className='box'>
                                        <img className='mr-3 horizontal-button' src='../src/assets/img/icon/share.png' style={{ width: "20px", height: "20px" }} />
                                    </div>
                                    <div className='box mt-3'>
                                        <p>Share</p>
                                    </div>
                                </button>
                            </div>

                        </div>
                        {showNotification && (
        <Notification
          message="You liked this item!"
          type="success" // Set the type of notification (success, info, warning, error)
          onClose={() => setShowNotification(false)} // Close the notification
        />
      )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Search;