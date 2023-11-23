import React, { useState, useEffect } from "react";
import axios from 'axios';
import Notification from "../notify";

const EditTrack = ({ audioId, closePopup }) => {

    const [notify, setNotify] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isPublic, setIsPublic] = useState(null);

    const handleRadioChange = (value) => {
        setIsPublic(value);
    };      
    
    const handleClick = (event) => {
        event.stopPropagation();
    }

    const handlePhotoChange = (e) => {
        const selectedPhoto = e.target.files[0];
        setSelectedImage(selectedPhoto);
    };

    const handleChange = async (audioId) => {
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

            console.log(isPublic);
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
              <form
                className="mt-3 border border-3 mb-5 p-4"
                style={{ background: "#fff" }}
                method="POST"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                onClick={handleClick}
              >
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="audioname" className="form-label">
                      Tiêu đề
                    </label>
                    <input
                      type="text"
                      className="form-control border"
                      id="audioname"
                      placeholder="Nhập tiêu đề bài hát"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="genre" className="form-label">
                      Thể loại
                    </label>
                    <select className="form-control border" id="genre">
                      <option value="" disabled>-- Thể loại --</option>
                      <option value="Pop">Pop</option>
                      <option value="Ballad">Ballad</option>
                      <option value="Rock">Rock</option>
                      <option value="Hip-Hop">Hip-Hop</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Mô tả
                  </label>
                  <textarea
                    className="form-control border"
                    id="description"
                    placeholder="Mô tả bài hát của bạn"
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <label className="form-check-label">Riêng tư:</label>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="access"
                        value="public"
                        className="form-check-input"
                        onChange={() => handleRadioChange(true)}
                        required
                      />
                      <label className="form-check-label">Công khai</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="access"
                        value="private"
                        className="form-check-input"
                        onChange={() => handleRadioChange(false)}
                        required
                      />
                      <label className="form-check-label">Cá nhân</label>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="Photo" className="form-label">
                    Ảnh nền:
                  </label>
                  <input
                    type="file"
                    className="form-control border"
                    id="Photo"
                    name="Photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  onClick={() => handleChange(audioId)}
                >
                  Cập nhật
                </button>
                {notify ? (
                  <Notification
                    onClose={() => setNotify(false)}
                    message="Thay đổi thành công"
                    type="success"
                  />
                ) : null}
              </form>
            </div>
          </div>
        </div>
      );
      
}
export default EditTrack;