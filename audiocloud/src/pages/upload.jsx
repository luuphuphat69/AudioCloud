import React, { useState, useEffect } from "react";
import NavbarLoggedIn from '../component/navbar/navbar_loggedin';
import NavbarLoggedOut from '../component/navbar/navbar_loggedout';
import axios from "axios";
import jwt from 'jwt-decode';
import {TailSpin} from "react-loader-spinner";

const Upload = () => {

    const [audioName, setAudioName] = useState(null);
    const [description, setDescription] = useState(null);
    const [isPublic, setIsPublic] = useState(true);
    const [genre, setGenre] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [userId, setUserId] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://3.105.51.135:8000/getcookie', { withCredentials: true });
                const receivedToken = response.data;
                const user = jwt(receivedToken);
                setToken(receivedToken);
                // Check the login status once the token is available
                checkLoginStatus();
                setUserId(user.userId);
                console.log("User ID: ", userId);
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


    const handleFileInputChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (selectedFile) {
            setIsLoading(true);
            // Implement the backend route to handle the file upload.
            const formData = new FormData();
            formData.append('Audio', selectedFile);
            formData.append('Photo', photo);
            formData.append('audioName', document.getElementById('audioname').value);
            formData.append('audioGenre', genre);
            formData.append('description', document.getElementById('description').value);
            formData.append('isPublic', isPublic);

            axios.post(`http://3.105.51.135:8000/v1/audio/postAudio/${userId}`, formData, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then((response) => {
                console.log(response.data);
                window.alert('File uploaded successfully.');
            }).catch((error) => {
                console.log('Error uploading file:', error);
                window.alert('File upload failed.');
            }).finally(() => {
                setIsLoading(false); // Hide loading spinner
            });;

            console.log('Uploading file:', selectedFile);
        } else {
            alert('Please select a file before uploading.');
        }
    };

    const handleRadioChange = (e) => {
        setIsPublic(e);
        console.log(isPublic);
    };

    const handleAudioNameChange = (e) => {
        setAudioName(e.target.value);
        console.log(audioName);
    };
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        console.log(description);
    };
    const handleGenreChange = (e) => {
        setGenre(e.target.value);
        console.log(genre);
    };

    const handlePhotoChange = (e) => {
        const selectedPhoto = e.target.files[0];
        setPhoto(selectedPhoto);
        // Create a URL for the selected image and set it in the state
        const imageURL = URL.createObjectURL(selectedPhoto);
        setSelectedImage(imageURL);
    };

    const handleSubmit = () => {
        if (audioName.length > 0 || genre.length > 0) {
            handleFileUpload();
        } else {
            window.alert("Some fields are empty");
        }
        console.log('Form data:', {
            audioName,
            description,
            genre,
            isPublic,
            photo,
        });
    };

    return (
        <div className="container">
            {isLoggedIn ? <NavbarLoggedIn /> : <NavbarLoggedOut />}
            <div className="wrapper mt-5">
                <form className="mt-3 border border-3 mb-5 p-4" method="POST" onSubmit={(e) => {
                    e.preventDefault();
                }}>
                    <div className="container_upload">
                        <h2 className="h1_upload">Đăng tải bài hát của bạn</h2>
                        <div className="upload-container">
                            <div className="border-container">
                                <input type="file" style={{color:"#000"}} id="Audio" name="Audio" accept=".mp3" onChange={handleFileInputChange} required />
                                <p>
                                    Hãy chọn file bài hát trước khi đăng tải.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="col-md-4 mb-3">
                            <label>Tiêu đề</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tiêu đề bài hát" id="audioname" onChange={handleAudioNameChange} required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label>Thể loại</label>
                            <select
                                className="form-control"
                                id="genre" onChange={handleGenreChange}>

                                <option value="">Chưa chọn</option>
                                <option value="Pop">Pop</option>
                                <option value="Ballad">Ballad</option>
                                <option value="Rock">Rock</option>
                                <option value="Hip-Hop">Hip-Hop</option>
                                {/* Add more genre options */}
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-6 mb-3">
                            <label>Mô tả</label>
                            <textarea
                                className="form-control"
                                id="description"
                                placeholder="Mô tả bài hát của bạn" onChange={handleDescriptionChange}></textarea>
                        </div>
                    </div>
                    <div className="form-row">
                        <label className="mt-3 ml-1">Riêng tư:</label>
                        <div className="radio-group ml-5">
                            <label className="radio-label mt-3">
                                <input
                                    type="radio"
                                    name="access"
                                    value="public"
                                    onChange={() => handleRadioChange(true)} required/>
                                Công khai
                            </label>
                            <label className="radio-label ml-5 mt-3">
                                <input
                                    type="radio"
                                    name="access"
                                    value="private"
                                    onChange={() => handleRadioChange(false)}/>
                                Cá nhân
                            </label>
                        </div>
                    </div>
                    <div className="form-row">
                        <label className="mt-3 ml-1" htmlFor="photo">
                            Ảnh nền:
                        </label>
                        <input
                            className="form-control ml-1"
                            type="file"
                            id="Photo" name="Photo"
                            accept="image/*"
                            onChange={handlePhotoChange} />
                        {selectedImage && (
                            <img
                                className="mt-2 ml-1"
                                src={selectedImage}
                                alt="Selected Artwork"
                                style={{ maxWidth: "50%", maxHeight: "50%" }}
                            />
                        )}
                    </div>
                    {isLoading ? (
                        <TailSpin type="TailSpin" color="#00BFFF" height={80} width={80} />
                    ) : (
                        <button className="btn btn-primary mt-3" type="submit" onClick={handleSubmit}>
                            Đăng tải
                        </button>
                    )}
                </form>
                <div>
                    <p>Bằng việc đăng nhạc, bạn đã xác nhận rằng bài hát của bạn đã phù hợp với<a href=""> Các điều khoản sử dụng</a> và bạn không vi phạm bản quyền của bất kỳ ai.</p>
                </div>
            </div>
        </div>
    );
};

export default Upload;