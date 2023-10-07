import React, { useState, useEffect } from "react";
import NavbarLoggedIn from '../component/navbar_loggedin';
import NavbarLoggedOut from '../component/navbar_loggedout';
import axios from "axios";

const Upload = () => {
    const [audioName, setAudioName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [genre, setGenre] = useState('');
    const [photo, setPhoto] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getcookie', { withCredentials: true });
                const receivedToken = response.data;
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

    const handleAudioNameChange = (e) => {
        setAudioName(e.target.value);
    };

    const handleRadioChange = (e) => {
        setIsPublic(e.target.value === 'public');
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Here, you can submit the form data (audioName, description, genre, photo) to your server or perform other actions.
        // For now, we'll just log the form data.
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
                <div className="container_upload">
                    <h1 className="h1_upload">Upload your audio</h1>
                    <div className="upload-container">
                        <div className="border-container">
                            <input type="file" id="file-upload" />
                            <p>
                                Drag and drop files here, or <a href="#" id="file-browser">browse</a> your computer.
                            </p>
                        </div>
                    </div>
                </div>
                <form className="mt-3 border border-3 mb-5 p-4">
                    <div className="form-row">
                        <div className="col-md-4 mb-3">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter audio title"
                                value={audioName}
                                onChange={handleAudioNameChange} required/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label>Genre</label>
                            <select
                                className="form-control"
                                id="genre"
                                value={genre}
                                onChange={handleGenreChange}>

                                <option value="">None</option>
                                <option value="Pop">Pop</option>
                                <option value="Rock">Rock</option>
                                <option value="Hip-Hop">Hip-Hop</option>
                                {/* Add more genre options */}
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-md-6 mb-3">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                id="description"
                                placeholder="Add a description"
                                value={description}
                                onChange={handleDescriptionChange}
                            ></textarea>
                        </div>
                    </div>
                    <div className="form-row">
                        <label className="mt-3 ml-1">Access:</label>
                        <div className="radio-group ml-5">
                            <label className="radio-label mt-3">
                                <input
                                    type="radio"
                                    name="access"
                                    value="public"
                                    checked={isPublic}
                                    onChange={handleRadioChange}
                                />
                                Public
                            </label>
                            <label className="radio-label ml-5 mt-3">
                                <input
                                    type="radio"
                                    name="access"
                                    value="private"
                                    checked={!isPublic}
                                    onChange={handleRadioChange}
                                />
                                Private
                            </label>
                        </div>
                    </div>
                    <div className="form-row">
                        <label className="mt-3 ml-1" htmlFor="photo">
                            Track Artwork:
                        </label>
                        <input
                            className="form-control ml-1"
                            type="file"
                            id="photo"
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
                    <button className="btn btn-primary mt-3" type="submit" onClick={handleSubmit}>
                        Save
                    </button>
                </form>
                <div>
                    <p>By uploading, you confirm that your sounds comply with our<a href=""> Terms of Use</a> and you don't infringe anyone else's rights.</p>
                </div>
            </div>
        </div>
    );
};

export default Upload;