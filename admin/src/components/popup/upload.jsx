import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { TailSpin } from "react-loader-spinner";
import Notification from "../notify";
import Cookies from "universal-cookie";

const Upload = ({ closePopup }) => {

    const [audioName, setAudioName] = useState(null);
    const [description, setDescription] = useState(null);
    const [isPublic, setIsPublic] = useState(true);
    const [genre, setGenre] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notify, setNotify] = useState(false);
    const [errorNotify, setErrorNotify] = useState(false);
    const [fileValidationError, setFileValidationError] = useState('');

    const cookies = new Cookies();
    const CookiesToken = cookies.get('token');

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const user = jwtDecode(CookiesToken);
                setToken(CookiesToken);
                const User = await axios.get(`http://audiocloud.asia:8000/v1/user/get-info/${user.userId}`);
                setUser(User.data);
                // Check the login status once the token is available
                checkLoginStatus();
                setUserId(user.userId);
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };
        fetchToken();
    }, [isLoggedIn]);

    const checkLoginStatus = () => {
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    };

    const isValidFile = (file) => {
        return file && (file.type === 'audio/mpeg' || file.type === 'audio/wav' || file.type === 'audio/flac' || file.type === 'audio/aiff');
    };

    const handleFileInputChange = (e) => {
        if (!isValidFile(e.target.files[0]) ) {
            setFileValidationError('Hãy chọn một file âm thanh');
        }else {
            setFileValidationError('');
            setSelectedFile(e.target.files[0]);
        }
    };

    const getTracks = async () => {
        const response = await axios.get(`http://audiocloud.asia:8000/v1/audio/getTracks/${userId}`);
        const tracks = response.data;
        return tracks.length;
    }

    const handleFileUpload = async () => {
        getTracks().then((result) => {
            
            if (selectedFile && !fileValidationError) {
                setIsLoading(true);
                // Implement the backend route to handle the file upload.
                const formData = new FormData();
                formData.append('Audio', selectedFile);
                formData.append('Photo', photo);
                formData.append('audioName', document.getElementById('audioname').value);
                formData.append('audioGenre', genre);
                formData.append('description', document.getElementById('description').value);
                formData.append('isPublic', isPublic);

                axios.post(`http://audiocloud.asia:8000/v1/audio/postAudio/${userId}`, formData, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then((response) => {
                    setNotify(true);
                }).catch((error) => {
                    console.log('Error uploading file:', error);
                    setErrorNotify(true);
                }).finally(() => {
                    setIsLoading(false); // Hide loading spinner
                    setNotify(true);
                });;
            } else {
                alert('Lỗi khi đăng tải. Hãy thử lại');
            }
        }).catch((error) => {
            console.error('An error occurred:', error);
        });
    };

    const handleRadioChange = (e) => {
        setIsPublic(e);
        console.log(isPublic);
    };

    const handleAudioNameChange = (e) => {
        setAudioName(e.target.value);
    };
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };
    const handleGenreChange = (e) => {
        setGenre(e.target.value);
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
        <div className="overlay" onClick={closePopup}>
            <div className="container">
                <div className="wrapper" style={{ backgroundColor: "#fff",padding: "20px" , maxHeight: "700px", overflowY: "auto"}}>
                    <form className="mt-3 border border-3 mb-5 p-4" method="POST" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.stopPropagation(); }}>
                        <h2 className="h1_upload mt-3">Đăng tải bài hát</h2>
                        <div className="upload-container">
                            <div className="border-container">
                                <input
                                    type="file"
                                    style={{ color: "#000", border: "1px solid #ced4da", borderRadius: "4px", padding: "6px" }}
                                    id="Audio"
                                    name="Audio"
                                    accept={".mp3, .flac, .wav, .alac, .aiff"}
                                    onChange={handleFileInputChange}
                                    required
                                />
                                <p style={{ color: 'red', marginTop: "5px" }}>{fileValidationError}</p>
                                <p>Hãy chọn file bài hát trước khi đăng tải.</p>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="col-md-6 mb-3">
                                <label>Tiêu đề</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tiêu đề bài hát"
                                    id="audioname"
                                    onChange={handleAudioNameChange}
                                    style={{ border: "1px solid #ced4da", borderRadius: "4px", padding: "6px" }}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Thể loại</label>
                                <select
                                    className="form-control"
                                    id="genre"
                                    onChange={handleGenreChange}
                                    style={{ border: "1px solid #ced4da", borderRadius: "4px", padding: "6px" }}
                                >
                                    <option value="">Chưa chọn</option>
                                    <option value="Pop">Pop</option>
                                    <option value="Ballad">Ballad</option>
                                    <option value="Rock">Rock</option>
                                    <option value="Hip-Hop">Hip-Hop</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="col-md-12 mb-3">
                                <label>Mô tả</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    placeholder="Mô tả bài hát của bạn"
                                    onChange={handleDescriptionChange}
                                    style={{ border: "1px solid #ced4da", borderRadius: "4px", padding: "6px" }}
                                ></textarea>
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
                                        onChange={() => handleRadioChange(true)}
                                        required
                                    />
                                    Công khai
                                </label>
                                <label className="radio-label ml-5 mt-3">
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

                        <div className="form-row">
                            <label className="mt-3 ml-1" htmlFor="photo">
                                Ảnh nền:
                            </label>
                            <input
                                className="form-control ml-1"
                                type="file"
                                id="Photo"
                                name="Photo"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                style={{ border: "1px solid #ced4da", borderRadius: "4px", padding: "6px" }}
                            />
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
                        <p>
                            Bằng việc đăng nhạc, bạn đã xác nhận rằng bài hát của bạn đã phù hợp với
                            <Link to="/terms-of-use"> Các điều khoản sử dụng</Link> và bạn không vi phạm bản quyền của bất kỳ ai.
                        </p>
                    </div>

                    {notify && (
                        <Notification
                            message="Đăng bài nhạc thành công"
                            type="success" // Set the type of notification (success, info, warning, error)
                            onClose={() => setNotify(false)} // Close the notification
                        />
                    )}

                    {errorNotify && (
                        <Notification
                            message="Lỗi khi đăng tải. Hãy thử lại"
                            type="error" // Set the type of notification (success, info, warning, error)
                            onClose={() => setErrorNotify(false)} // Close the notification
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Upload;