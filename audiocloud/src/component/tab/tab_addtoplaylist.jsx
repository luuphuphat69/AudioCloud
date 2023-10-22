import React, { useState, useEffect } from 'react';
import Notification from '../notify/notify_comp';
import axios from 'axios';
import jwt from 'jwt-decode';

const Tab_AddToPlaylist = (audioId) => {
    const [userId, setUserId] = useState(null);
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState(''); // State for input value
    const [showNotification, setShowNotification] = useState(false);

    // Fetch the token and set userId
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getcookie', { withCredentials: true });
                const token = jwt(response.data);
                const userId = token.userId;
                setUserId(userId);
            } catch (error) {
                console.log(error);
            }
        }
        fetchToken();
    }, []);

    // Fetch data based on userId
    useEffect(() => {
        if (userId) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/v1/playlist/get-user-playlist/${userId}`);
                    setData(response.data);
                } catch (error) {
                    console.log(error);
                }
            }
            fetchData();
        }
    }, [userId]);

    const handleClick = async (audioId, playlistId) => {
        console.log(audioId.audioId);
        setShowNotification(true);
        await axios.put(`http://localhost:8000/v1/playlist/add-to-playlist/${audioId.audioId}/${playlistId}`);
        console.log("add success");
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value); // Update the input value
    };

    const filteredData = data.filter((item) =>
        item.Title?.toLowerCase().includes(inputValue?.toLowerCase())
    );

    const popupFormStyle = {
        background: '#F0F0F0',
        width: '35rem',
        height: '50vh',
    };

    return (
        <div className="popup-form p-2" style={popupFormStyle}>
            <input
                className="form-control"
                type="search"
                placeholder="Filter playlists"
                aria-label="Search..."
                value={inputValue} // Bind the input value
                onChange={handleInputChange} // Handle input change
            />
            <div className='mt-2'>
                {filteredData.slice(0, 3).map((item) => (
                    <div className='d-block d-md-flex podcast-entry mb-3'>
                        <div className='image-container'>
                            <img src='../src/assets/img/playlist.jpeg' style={{ width: "70px", height: "70px" }} />
                        </div>

                        <div className="text ml-2">
                            <h5>{item.Title}</h5>
                            <h6 className='font-weight-light'>{item.Genre}</h6>
                        </div>
                        <button className='mt-2' onClick={() => handleClick(audioId, item.PlaylistId)} style={{ marginLeft: "auto", height: "50px", color: "#000" }}>Add to playlist</button>
                    </div>
                ))}
            </div>
            {showNotification && (
                <Notification
                    message="Added to playlist successful"
                    type="success" // Set the type of notification (success, info, warning, error)
                    onClose={() => setShowNotification(false)} // Close the notification
                />
            )}
        </div>
    );
}

export default Tab_AddToPlaylist;
