import React, { useState, useEffect } from 'react';
import jwt from 'jwt-decode';
import axios from 'axios';
import { TailSpin } from "react-loader-spinner";

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


  const handlePhotoChange = (e) => {
    const selectedPhoto = e.target.files[0];
    setPhoto(selectedPhoto);

    // Create a URL for the selected image and set it in the state
    const imageURL = URL.createObjectURL(selectedPhoto);
    setSelectedImage(imageURL);
    console.log(imageURL);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://3.106.53.25:8000/v1/user/get-info/${userId}`, { withCredentials: true });
        const _user = response.data;
        setUser(_user);
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('http://3.106.53.25:8000/getcookie', { withCredentials: true });
        const receivedToken = response.data;
        const user = jwt(receivedToken);
        setToken(receivedToken);
        // Check the login status once the token is available
        setUserId(user.userId);
        console.log("User ID: ", userId);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchToken();
  }, [token]);

  const handleChanges = async () => {
    const formData = new FormData();
    formData.append('UserPhoto', photo);
    formData.append("Displayname", document.getElementById('displayname')?.value);
    formData.append("Bio", document.getElementById('bio')?.value);
    formData.append("Address", document.getElementById('address')?.value);

    axios.put(`http://3.106.53.25:8000/v1/user/edit/${userId}`, formData, {
      method: "PUT",
      credentials: "include",
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then((response) => {
      console.log(response.data);
      window.alert('Update successfully.');
    }).catch((error) => {
      console.log('Error uploading file:', error);
      window.alert('File upload failed.');
    }).finally(() => {
      setIsLoading(false); // Hide loading spinner
    });;
  }

  return (
    <div className="overlay" onClick={closePopup}>
      <div className="popup-form" style={popupFormStyle}>
        <div className="wrapper" style={wrapperStyle}>
          <h2>Edit your profile</h2>
          <form className="mt-3 border border-3 mb-5 p-4" method="POST" onClick={(e) => {
              e.stopPropagation(); // Prevent click event from propagating to the outer div
            }}>
            <div className="form-row">
              <div className="col-md-4 mb-3">
                <label>Displayname</label>
                <input
                  type="text"
                  id='displayname'
                  className="form-control"
                  defaultValue={user?.Displayname}
                  placeholder="Enter your displayname" required />
              </div>
              <div className="col-md-4 mb-3">
                <label>Address</label>
                <input
                  type="text"
                  id='address'
                  className="form-control"
                  defaultValue={user?.Address}
                  placeholder='Your address' required />
              </div>
            </div>
            <div className="form-row">
              <div className="col-lg-5 mb-3">
                <label>Bio</label>
                <textarea
                  className="form-control"
                  id="bio"
                  defaultValue={user?.Bio}
                  placeholder="Tell the world a little bit about yourself. The shorter the better"></textarea>
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
                Update image:
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
                Save changes
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;
