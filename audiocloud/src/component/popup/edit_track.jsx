import React, { useState, useEffect } from "react";
import axios from 'axios';
import Notification from "../notify/notify_comp";
const EditTrack = ({ audioId, closePopup }) => {

    const [notify, setNotify] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isPublic, setIsPublic] = useState(null);

    const handleRadioChange = (e) => {
        setIsPublic(e);
        console.log(isPublic);
    };
    const handleClick = (event) => {
        event.stopPropagation();
    }

    const handlePhotoChange = (e) => {
        const selectedPhoto = e.target.files[0];
        setSelectedImage(selectedPhoto);
    };

    const handleChange = async (audioId) => {
        console.log(audioId);
        try {
            const audioName = document.getElementById('audioname').value;
            const genre = document.getElementById('genre').value;
            const description = document.getElementById('description').value;

            const formData = new FormData();
            formData.append('Photo', selectedImage);
            formData.append('audioName', audioName);
            formData.append('genre', genre);
            formData.append('description', description);
            formData.append('isPublic', isPublic);

            await axios.put(`http://audiocloud.asia:8000/v1/audio/edit-track/${audioId}`, formData, {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then((response) => {
                setIsLoading(true);
                setNotify(true);
            }).catch((error) => {
                console.log('Error uploading file:', error);
                window.alert('File upload failed.');
            }).finally(() => {
                setIsLoading(false); // Hide loading spinner
            });;;

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="overlay" onClick={closePopup}>
            <div className="container">
                <div className="wrapper mt-5">
                    <h4>Chỉnh sửa bài hát của bạn</h4>
                    <form className="mt-3 border border-3 mb-5 p-4" style={{ background: "#fff" }} method="POST" onSubmit={(e) => {
                        e.preventDefault();
                    }} onClick={handleClick}>
                        <div className="form-row" >
                            <div className="col-md-4 mb-3">
                                <label>Tiêu đề</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tiêu đề bài hát" id="audioname" required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Thể loại</label>
                                <select
                                    className="form-control"
                                    id="genre" >

                                    <option value="">Chưa chọn</option>
                                    <option value="Pop">Pop</option>
                                    <option value="Ballad">Ballad</option>
                                    <option value="Rock">Rock</option>
                                    <option value="Hip-Hop">Hip-Hop</option>

                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-md-6 mb-3">
                                <label>Mô tả</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    placeholder="Mô tả bài hát của bạn"></textarea>
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
                                        required />
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
                                id="Photo" name="Photo"
                                accept="image/*"
                                onChange={handlePhotoChange} />
                        </div>
                        <button className="btn btn-primary mt-3" type="submit" onClick={() => handleChange(audioId)}>
                            Cập nhật
                        </button>
                        {notify ? <Notification onClose={() => setNotify(false)} message="Thay đổi thành công" type="success" /> : null}
                    </form>
                </div>
            </div>
        </div>
    );
}
export default EditTrack;