import React, { useState, useEffect } from "react";
import NavbarLoggedOut from '../component/navbar_loggedout';
import NavbarLoggedIn from '../component/navbar_loggedin';
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
    const [ifClicked, setIfClicked] = useState('');

    const handleClick = (type) => {
        setIfClicked(type);
        console.log(ifClicked);
    }

    useEffect(() => {
        // Fetch the token when the component mounts
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getcookie', { withCredentials: true }); // Get Cookies data
                const receivedToken = response.data;
                setToken(receivedToken);

                // Check the login status once the token is available
                checkLoginStatus();

                // Get user from jwt (decoded)
                const user = jwt(token);

                // Fetch user data using the userId
                const userDataResponse = await axios.get(`http://localhost:8000/v1/user/getUserInfo/${user.userId}`, { withCredentials: true });
                setUser(userDataResponse.data);
                setUserPhoto(user.PhotoURL);
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, [isLoggedIn]);

    const checkLoginStatus = () => {
        // Check if the token exists and update the login status
        if (token) {
            setIsLoggedIn(true);
            console.log(isLoggedIn);
        } else {
            setIsLoggedIn(false);
            console.log(isLoggedIn);
        }
    };

    return (
        <div class="container-fluid px-2 px-md-4">
            {isLoggedIn ? <NavbarLoggedIn /> : <NavbarLoggedOut />}
            <div class="page-header min-height-400 border-radius-xl mt-5">
            </div>
            <div class="card card-body mx-3 mx-md-4 mt-n6">
                <div class="row gx-4 mb-2">
                    <div class="col-auto">
                        <div class="avatar avatar-xl position-relative">
                            {userPhoto ? <img src={user.PhotoURL} alt="profile_image" class="w-100 border-radius-lg shadow-sm" /> : <img src="../src/assets/img/blur_img.png" />}
                        </div>
                    </div>
                    <div class="col-auto my-auto">
                        <div class="h-100">
                            <h5 class="mb-1">
                                {user?.Displayname}
                            </h5>
                            <p class="mb-0 font-weight-normal text-sm">
                                {user?.Bio}
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
                        <div class="nav-wrapper position-relative end-0">
                            <ul class="nav nav-pills nav-fill p-1" role="tablist">
                                <li class="nav-item1">
                                    <a class="nav-link1 mb-0 px-0 py-1 active " data-bs-toggle="tab" href="" onClick={(e) => {
                                        e.preventDefault(); // Prevent the default behavior
                                        handleClick('Tracks');
                                    }} role="tab" aria-selected="true">
                                        <span class="ms-1">Tracks</span>
                                    </a>
                                </li>
                                <li class="nav-item1">
                                    <a class="nav-link1 mb-0 px-0 py-1 active" data-bs-toggle="tab" role="tab" href=""  onClick={(e) => {
                                        e.preventDefault(); // Prevent the default behavior
                                        handleClick('Albums');
                                    }} aria-selected="false">
                                        <span class="ms-1">Albums</span>
                                    </a>
                                </li>
                                <li class="nav-item1">
                                    <a class="nav-link1 mb-0 px-0 py-1 active" data-bs-toggle="tab" role="tab" href=""  onClick={(e) => {
                                        e.preventDefault(); // Prevent the default behavior
                                        handleClick('Playlists');
                                    }} aria-selected="false">
                                        <span class="ms-1">Playlists</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {ifClicked === 'Tracks' ? <Tracks /> : ifClicked === 'Albums' ? <Albums /> : ifClicked === 'Playlists' ? <Playlists /> : <Tracks/>}
            </div>
        </div>
    );
}
export default Profile;