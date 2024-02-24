import React, { useState, useEffect } from "react";
import jwt from 'jwt-decode';
import axios from "axios";
import Notification from '../notify/notify_comp';
import Cookies from "universal-cookie";
import { useMediaQuery } from 'react-responsive';

const Tab_CreatePlaylist = () => {

    const cookies = new Cookies();
    const CookiesToken = cookies.get('token');
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' })

    const popupFormStyle = {
        background: '#F0F0F0',
        width: '37rem',
        height: '50vh',
    };
    const [isPublic, setIsPublic] = useState(true);
    const [userId, setUserId] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notify, setNotify] = useState(false);

    const radioContainerStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = jwt(CookiesToken);
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

            await axios.post(`http://54.161.251.210:8000/v1/playlist/create/${userId}`, data, {
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
                    setNotify(true);
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

    if (isDesktopOrLaptop) {
        return (
            <div className="popup-form p-2" style={popupFormStyle}>
                <form method="POST">
                    <div className="container_upload">
                        {/* Title Input */}
                        <input type="text" id="title" className="form-control" placeholder="Tiêu đề" required />
                        {/* Genre Input */}
                        <input type="text" id="genre" className="form-control mt-2" placeholder="Thể loại" />
                        {/* Access Input */}
                        <label className="mt-3 ml-1">Riêng tư:</label>
                        <label className="radio-label mt-3 ml-3">
                            <input
                                type="radio"
                                name="access"
                                value="public"
                                onChange={() => handleRadioChange(true)} required />
                            Công khai
                        </label>
                        <label className="radio-label ml-5 mt-3">
                            <input
                                type="radio"
                                name="access"
                                value="private"
                                onChange={() => handleRadioChange(false)} />
                            Cá nhân
                        </label>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className="btn btn-primary mt-3" type="button" onClick={handleClick}>Save</button>
                    </div>
                </form>
                {showNotification && (
                    <Notification
                        message="Playlist đã tồn tại. Hãy thử bằng tên khác"
                        type="error" // Set the type of notification (success, info, warning, error)
                        onClose={() => setShowNotification(false)} // Close the notification
                    />
                )}
                {notify && (
                    <Notification
                        message="Tạo playlist thành công"
                        type="success" // Set the type of notification (success, info, warning, error)
                        onClose={() => setNotify(false)} // Close the notification
                    />
                )}
            </div>
        );
    } else if (isTabletOrMobile) {
        const popupFormStyle = {
            maxHeight: '350px', // Set the maximum height
            overflowY: 'auto', // Add vertical scrolling if content overflows
        };

        return (
            <div className="popup-form p-2" style={popupFormStyle}>
                <form method="POST">
                    <div className="container_upload">
                        {/* Title Input */}
                        <input type="text" id="title" className="form-control" placeholder="Tiêu đề" required />
                        {/* Genre Input */}
                        <input type="text" id="genre" className="form-control mt-2" placeholder="Thể loại" />
                        {/* Access Input */}
                        <label className="mt-3 ml-1">Riêng tư:</label>
                        <div style={radioContainerStyle}>
                            <label className="radio-label ml-3">
                                <input
                                    type="radio"
                                    name="access"
                                    value="public"
                                    onChange={() => handleRadioChange(true)}
                                    required
                                />
                                Công khai
                            </label>
                            <label className="radio-label ml-3">
                                <input
                                    type="radio"
                                    name="access"
                                    value="private"
                                    onChange={() => handleRadioChange(false)}
                                />
                                Cá nhân
                            </label>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className="btn btn-primary mt-3" type="button" onClick={handleClick}>
                            Save
                        </button>
                    </div>
                </form>
                {showNotification && (
                    <Notification
                        message="Playlist đã tồn tại. Hãy thử bằng tên khác"
                        type="error"
                        onClose={() => setShowNotification(false)}
                    />
                )}
                {notify && (
                    <Notification
                        message="Tạo playlist thành công"
                        type="success" // Set the type of notification (success, info, warning, error)
                        onClose={() => setNotify(false)} // Close the notification
                    />
                )}
            </div>
        );
    }

}
export default Tab_CreatePlaylist;