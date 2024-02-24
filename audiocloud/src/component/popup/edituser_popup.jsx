import React, { useState, useEffect } from 'react';
import jwt from 'jwt-decode';
import axios from 'axios';
import { TailSpin } from "react-loader-spinner";
import Cookies from 'universal-cookie';

const popupFormStyle = {
  background: '#F0F0F0',
  width: '1000px', // Adjust the width as needed
  height: '80vh', // Adjust the height as needed
  display: 'flex',
  alignItems: 'center', // Vertical centering
  justifyContent: 'center', // Horizontal centering
  flexDirection: 'column', // Stack children vertically
};

const wrapperStyle = {
  width: '100%', // Ensure the content width is 100% within the container
  maxWidth: '1000px', // Limit the maximum width of the form content
};

const PopupForm = ({ closePopup }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const cookies = new Cookies();
  const CookiesToken = cookies.get('token');

  const handlePhotoChange = (e) => {
    const selectedPhoto = e.target.files[0];
    setPhoto(selectedPhoto);

    // Create a URL for the selected image and set it in the state
    const imageURL = URL.createObjectURL(selectedPhoto);
    setSelectedImage(imageURL);
    console.log(imageURL);
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const user = jwt(CookiesToken);
        setToken(CookiesToken);
        // Check the login status once the token is available
        setUserId(user.userId);
        console.log("User ID: ", userId);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchToken();
  }, [token]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://54.161.251.210:8000/v1/user/get-info/${userId}`, { withCredentials: true });
        const _user = response.data;
        setUser(_user);
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);

  const handleChanges = async () => {
    const formData = new FormData();
    formData.append('UserPhoto', photo);
    formData.append("Displayname", document.getElementById('displayname')?.value);
    formData.append("Bio", document.getElementById('bio')?.value);
    formData.append("Address", document.getElementById('address')?.value);

    axios.put(`http://54.161.251.210:8000/v1/user/edit/${userId}`, formData, {
      method: "PUT",
      credentials: "include",
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then((response) => {
      window.alert('Cập nhật thông tin thành công');
    }).catch((error) => {
      console.log('Error uploading file:', error);
      window.alert('Cập nhật thông tin thất bại. Hãy thử lại');
    }).finally(() => {
      setIsLoading(false); // Hide loading spinner
    });;
  }

  return (
    <div className="overlay" onClick={closePopup}>
      <div className="popup-form" style={popupFormStyle}>
        <div className="wrapper" style={wrapperStyle}>
          <h2>Chỉnh sửa thông tin</h2>
          <form className="mt-3 border border-3 mb-5 p-4" method="POST" onClick={(e) => {
              e.stopPropagation(); // Prevent click event from propagating to the outer div
            }}>
            <div className="form-row">
              <div className="col-md-4 mb-3">
                <label>Tên hiển thị</label>
                <input
                  type="text"
                  id='displayname'
                  className="form-control"
                  defaultValue={user?.Displayname}
                  placeholder="Nhập vào Tên hiển thị" required />
              </div>
              <div className="col-md-4 mb-3">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  id='address'
                  className="form-control"
                  defaultValue={user?.Address}
                  placeholder='Địa chỉ của bạn' required />
              </div>
            </div>
            <div className="form-row">
              <div className="col-lg-5 mb-3">
                <label>Tiểu sử</label>
                <textarea
                  className="form-control"
                  id="bio"
                  defaultValue={user?.Bio}
                  placeholder="Hãy kể cho thế giới một ít về bạn. Càng ngắn càng tốt"></textarea>
              </div>
            </div>
            <div className='form-row'>
              <div className='col-md-4 mb-3'>
                {selectedImage && (
                  <img
                    className="mt-2"
                    src={selectedImage}
                    alt="Selected Artwork"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                )}
              </div>
            </div>
            <div className="form-row">
              <label className="mt-3 ml-1" htmlFor="photo">
                Thay ảnh đại diện:
              </label>
              <input
                className="form-control ml-1"
                type="file"
                id="UserPhoto" name="UserPhoto"
                onChange={handlePhotoChange}
                accept="image/*" />
            </div>
            {isLoading ? (
              <TailSpin type="TailSpin" color="#00BFFF" height={80} width={80} />
            ) : (
              <button className="btn btn-primary mt-3" type="button" onClick={handleChanges}>
                Lưu thay đổi
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;
