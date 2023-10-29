import React, { useState, useEffect } from "react";
import axios from 'axios';
import jwt from 'jwt-decode';
import { useAPlayer } from '../component/player_context';
import Notification from '../component/notify/notify_comp';
import EditPlaylist_Popup from "./popup/edit_playlist";

const Playlists = () => {

    const [token, setToken] = useState(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [data, setData] = useState([]);

    const [showNotification, setShowNotification] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const { initializeAPlayer } = useAPlayer();

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://54.206.75.221:8000/get-cookies', { withCredentials: true });
                const receivedToken = response.data;
                setToken(receivedToken);

                const _user = jwt(token);

                const responseData = await axios.get(`http://54.206.75.221:8000/v1/playlist/get-user-playlist/${_user?.userId}`);
                setData(responseData.data);
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, [token]);

    const handleClick = async (playlistId) => {
        const response = await axios.get(`http://54.206.75.221:8000/v1/playlist/getInfo/${playlistId}`);
        const playlist = response.data;
        initializeAPlayer(playlist.ListAudio);
    }

    const handleRemove = async (playlistId) => {
        await axios.delete(`http://54.206.75.221:8000/v1/playlist/delete/${playlistId}`);
        const updatedData = data.filter((item) => item.PlaylistId !== playlistId);
        setData(updatedData);
        setShowNotification(true);
    }

    const handleItemClick = (playlistId) => {
        setShowPopup(true);
        setSelectedPlaylist(playlistId);
    }
    const onClose = () => {
        setShowPopup(false);
    }
    return (
        <div>
            <div className="playlist-grid mb-5">
                {data.map((item) => (
                    <div key={item.PlaylistId} className="playlist-item">
                        <div className="button-container">
                            <button className="circle-button-1" type="button" onClick={() => handleRemove(item.PlaylistId)}>
                                X
                            </button>
                        </div>
                        <div className="image-container"  onClick={() => handleItemClick(item.PlaylistId)}>
                            <img src='../src/assets/img/playlist.jpeg' alt='playlist' />
                            <div className="center-button">
                                <button className="btn-95 mb-4" onClick={(e) => {e.stopPropagation(); handleClick(item.PlaylistId)}}>
                                    <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60">
                                        <g>
                                            <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <h2>{item.Title}</h2>
                        <p>Thể loại: {item.Genre}</p>
                    </div>
                ))}
                {showNotification && (
                    <Notification
                        message="Xóa thành công"
                        type="success" // Set the type of notification (success, info, warning, error)
                        onClose={() => setShowNotification(false)} // Close the notification
                    />
                )}
                {showPopup ? <EditPlaylist_Popup playlistId={selectedPlaylist} closePopup={onClose}/> : null}
            </div>
        </div>
    );
}
export default Playlists;