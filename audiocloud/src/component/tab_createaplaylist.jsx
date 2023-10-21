import React, { useState, useEffect } from "react";
import jwt from 'jwt-decode';
import axios from "axios";
import Notification from '../component/notify/notify_comp';

const Tab_CreatePlaylist = () => {
    const popupFormStyle = {
        background: '#F0F0F0',
        width: '35rem',
        height: '50vh',
    };
    const [isPublic, setIsPublic] = useState(true);
    const [userId, setUserId] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    
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

    const handleClick = async () => {
        try {
            const title = document.getElementById('title').value;
            const genre = document.getElementById('genre').value;
    
            // Create a URL-encoded string
            const data = new URLSearchParams();
            data.append('title', title);
            data.append('genre', genre);
            data.append('isPublic', isPublic);
    
            await axios.post(`http://localhost:8000/v1/playlist/create/${userId}`, data, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then((response) => {
                if (response.status === 400) {
                    // Handle validation errors here
                    setShowNotification(true);
                } else {
                    window.alert('Success');
                }
            }).catch((error) => {
                console.log(error);
                setShowNotification(true);
            });
        } catch (err) {
            console.log(err);
            setShowNotification(true);
        }
    };  

    const handleRadioChange = (e) => {
        setIsPublic(e);
        console.log(isPublic);
    };
    return (
        <div className="popup-form p-2" style={popupFormStyle}>
            <form method="POST">
                <div className="container_upload">
                    {/* Title Input */}
                <input type="text" id="title" className="form-control" placeholder="Title" required/>
                {/* Genre Input */}
                <input type="text" id="genre" className="form-control mt-2" placeholder="Genre" />
                {/* Access Input */}
                <label className="mt-3 ml-1">Access:</label>
                <label className="radio-label mt-3 ml-3">
                    <input
                        type="radio"
                        name="access"
                        value="public"
                        onChange={() => handleRadioChange(true)} required />
                    Public
                </label>
                <label className="radio-label ml-5 mt-3">
                    <input
                        type="radio"
                        name="access"
                        value="private"
                        onChange={() => handleRadioChange(false)} />
                    Private
                </label>
                </div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <button className="btn btn-primary mt-3" type="button" onClick={handleClick}>Save</button>
                </div>
            </form>
            {showNotification && (
                <Notification
                    message="Playlist is exist. Try another name"
                    type="error" // Set the type of notification (success, info, warning, error)
                    onClose={() => setShowNotification(false)} // Close the notification
                />
            )}
        </div>
    );
}
export default Tab_CreatePlaylist;