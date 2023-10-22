import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Notification from '../notify/notify_comp';

const EditPlaylist_Popup = ({ playlistId, closePopup }) => {

    const [data, setData] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const [notification, setNotification] = useState(false);
    const [notificationRemove, setRemoveNotification] = useState(false);
    const [playlist, setPlaylist] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/v1/playlist/getInfo/${playlistId}`);
                setData(response.data.ListAudio); // Access ListAudio property in response.data
                setPlaylist(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [playlistId]);

    const handleEdit = async (playlistId) => {
        try {
            const title = document.getElementById('title').value;
            const genre = document.getElementById('genre').value;

            // Create a URL-encoded string
            const formData = new URLSearchParams();
            formData.append('title', title);
            formData.append('genre', genre);
            formData.append('isPublic', isPublic);

            await axios.put(`http://localhost:8000/v1/playlist/edit/${playlistId}`, formData, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            setNotification(true);
        } catch (err) {
            console.log(err);
        }
    }

    const handleRemoveAudio = async (audioId, playlistId) => {
        await axios.put(`http://localhost:8000/v1/playlist/remove-audio/${audioId}/${playlistId}`);
        setRemoveNotification(true);
        const updatedResponse = await axios.get(`http://localhost:8000/v1/playlist/getInfo/${playlistId}`);
        setData(updatedResponse.data.ListAudio);
    }

    const popupFormStyle = {
        background: '#F0F0F0',
        width: '41rem',
        height: '85vh',
    };
    const handleRadioChange = (e) => {
        setIsPublic(e);
        console.log(isPublic);
    };
    return (
        <div className="overlay" onClick={closePopup}>
            <div className="container card card-custome shadow d-flex justify-content-center mt-5">
                <div className="popup-form p-2" style={popupFormStyle}>
                    <form method="POST" onClick={(e) => e.stopPropagation()}>
                        <div className="container_upload">
                            {/* Title Input */}
                            <input type="text" id="title" className="form-control" placeholder="Title" />
                            {/* Genre Input */}
                            <input type="text" id="genre" className="form-control mt-2" placeholder="Genre" />
                            {/* Access Input */}
                            <label className="mt-3 ml-1">Access:</label>
                            <label className="radio-label mt-3 ml-3">
                                <input
                                    type="radio"
                                    name="access"
                                    value="public"
                                    onChange={() => handleRadioChange(true)} />
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
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button className="btn btn-primary mt-3" type="button" onClick={() => { handleEdit(playlistId) }}>Save</button>
                        </div>
                    </form>
                    <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                        {data?.map((item) => (
                            <div className='d-block d-md-flex podcast-entry mb-3' onClick={(e) => e.stopPropagation()}>
                                <div className='image-container'>
                                    {item.PhotoURL ? <img src={item.PhotoURL} style={{ width: "70px", height: "70px" }} />
                                        : <img src='../src/assets/img/blur_img.png' style={{ width: "70px", height: "70px" }} />}
                                </div>

                                <div className="text ml-2">
                                    <h5>{item.AudioName}</h5>
                                    <h6 className='font-weight-light'>{item.Genre}</h6>
                                </div>
                                <button className='mt-2' style={{ marginLeft: "auto", height: "50px", color: "#000" }} onClick={() => handleRemoveAudio(item.AudioId, playlistId)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    {notification && (
                        <Notification
                            message="Updated !!"
                            type="success" // Set the type of notification (success, info, warning, error)
                            onClose={() => setNotification(false)} // Close the notification
                        />
                    )}
                    {notificationRemove && (
                        <Notification
                            message="Removed !!"
                            type="success" // Set the type of notification (success, info, warning, error)
                            onClose={() => setNotification(false)} // Close the notification
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
export default EditPlaylist_Popup;