import React, { useState, useEffect } from "react";
import NavbarLoggedOut from '../component/navbar/navbar_loggedout';
import NavbarLoggedIn from '../component/navbar/navbar_loggedin';
import Popup from 'reactjs-popup';
import PopupForm from "../component/popup";
import Tracks from "../component/tracks";
import Playlists from "../component/playlist";
import Albums from "../component/albums";
import axios from "axios";
import jwt from 'jwt-decode';

const Profile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [userPhoto, setUserPhoto] = useState(null);
    const [ifClicked, setIfClicked] = useState('Tracks'); // Set a default value for ifClicked
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
        console.log(isPopupVisible);
    };

    const handleClick = (type) => {
        setIfClicked(type);
    }

    useEffect(() => {
        // Fetch the token when the component mounts
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getcookie', { withCredentials: true });
                const receivedToken = response.data;
                setToken(receivedToken);
                checkLoginStatus();

                const _user = jwt(token);
                const userDataResponse = await axios.get(`http://localhost:8000/v1/user/get-info/${_user.userId}`, { withCredentials: true });
                setUser(userDataResponse.data);
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, [isLoggedIn]);

    useEffect(() => {
        try{
            if(user){
                setUserPhoto(user.ProfilePic);
            }
        }catch(error){
            console.log(error);
        }
    }, [user]);

    const checkLoginStatus = () => {
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    };

    return (
        <div class="container-fluid px-2 px-md-4">
            {isLoggedIn ? <NavbarLoggedIn /> : <NavbarLoggedOut />}
            <div class="page-header min-height-400 border-radius-xl mt-5">
            </div>
            {isPopupVisible && (
                <Popup
                    open={isPopupVisible}
                    closeOnDocumentClick
                    onClose={togglePopup}>
                    <PopupForm closePopup={togglePopup} />
                </Popup>
            )}
            <div class="card card-body mx-3 mx-md-4 mt-n6">
                <div class="row gx-4 mb-2">
                    <div class="col-auto">
                        <div class="avatar avatar-xl position-relative">
                            {userPhoto ? <img src={user.ProfilePic} alt="profile_image" class="w-100 border-radius-lg shadow-sm" /> : <img src="../src/assets/img/blur_img.png" />}
                        </div>
                    </div>
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 className="mb-1">
                                {user?.Displayname}
                                <a href="#" className="ml-2" onClick={togglePopup}>
                                    <span role="img" aria-label="Edit" className="edit-icon">
                                        ✏️
                                    </span>
                                </a>
                            </h5>
                            <p class="mb-1 font-weight-normal text-sm" style={{ color: "#fff", background: "#000" }}>
                                {user?.Bio}
                            </p>
                            <p class="mb-0 font-weight-normal text-sm" style={{ color: "#fff", background: "#000" }}>
                                {user?.Address}
                            </p>
                        </div>
                    </div>

                    <div class="col-md-6 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
                        <div class="nav-wrapper position-relative end-0">
                            <ul class="nav nav-pills nav-fill p-1" role="tablist">
                                <li class="nav-item1">
                                    <a class={`nav-link1 mb-0 px-0 py-1 ${ifClicked === 'Tracks' ? 'active' : ''}`} data-bs-toggle="tab" href="" onClick={(e) => {
                                        e.preventDefault();
                                        handleClick('Tracks');
                                    }} role="tab" aria-selected={ifClicked === 'Tracks' ? 'true' : 'false'}>
                                        <span class="ms-1">Tracks</span>
                                    </a>
                                </li>
                                <li class="nav-item1">
                                    <a class={`nav-link1 mb-0 px-0 py-1 ${ifClicked === 'Albums' ? 'active' : ''}`} data-bs-toggle="tab" role="tab" href="" onClick={(e) => {
                                        e.preventDefault();
                                        handleClick('Albums');
                                    }} aria-selected={ifClicked === 'Albums' ? 'true' : 'false'}>
                                        <span class="ms-1">Albums</span>
                                    </a>
                                </li>
                                <li class="nav-item1">
                                    <a class={`nav-link1 mb-0 px-0 py-1 ${ifClicked === 'Playlists' ? 'active' : ''}`} data-bs-toggle="tab" role="tab" href="" onClick={(e) => {
                                        e.preventDefault();
                                        handleClick('Playlists');
                                    }} aria-selected={ifClicked === 'Playlists' ? 'true' : 'false'}>
                                        <span class="ms-1">Playlists</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {ifClicked === 'Tracks' ? <Tracks /> : ifClicked === 'Albums' ? <Albums /> : ifClicked === 'Playlists' ? <Playlists /> : null}
            </div>
        </div>
    );
}
export default Profile;