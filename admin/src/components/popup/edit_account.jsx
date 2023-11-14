import axios from "axios";
import React, { useState, useEffect } from "react";
import Notification from "../notify";
import { TailSpin } from "react-loader-spinner";

const EditAccount = ({userId, closePopup }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('');
  const [photo, setPhoto] = useState(null);
  const [notify, setNotify] = useState(false);

  const [displayname, setDisplayname] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://audiocloud.asia:8000/v1/user/get-info/${userId}`, { withCredentials: true });
        const _user = response.data;
        setUser(_user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleDisplaynameChange = (e) => {
    setDisplayname(e.target.value);
  };
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const selectedPhoto = e.target.files[0];
    setPhoto(selectedPhoto);

    // Create a URL for the selected image and set it in the state
    const imageURL = URL.createObjectURL(selectedPhoto);
    setSelectedImage(imageURL);
    console.log(imageURL);
  };

  const handleEdit = (userId) => {
    const formData = new FormData();
    formData.append('UserPhoto', photo);
    formData.append("Displayname", displayname);
    formData.append("Bio", bio);
    formData.append("Address", address);
    formData.append("Role", role);

    axios.put(`http://audiocloud.asia:8000/v1/user/edit-user/${userId}`, formData, {
      method: "PUT",
      credentials: "include",
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then((response) => {
      setNotify(true);
    }).catch((error) => {
      console.log('Error uploading file:', error);
      window.alert('Cập nhật người dùng thất bại');
    }).finally(() => {
      setIsLoading(false); // Hide loading spinner
    });;
  }

  const popupFormStyle = {
    background: '#F0F0F0',
    width: '1000px', // Adjust the width as needed
    height: '80vh', // Adjust the height as needed
    display: 'flex',
    alignItems: 'center', // Vertical centering
    justifyContent: 'center', // Horizontal centering
    flexDirection: 'column', // Stack children vertically
    marginLeft: "240px"
  };

  const wrapperStyle = {
    width: '100%', // Ensure the content width is 100% within the container
    maxWidth: '1000px', // Limit the maximum width of the form content
  };

  const handleClose = () => {
    setNotify(false);
  }

  return (
    <div className="overlay" onClick={closePopup}>
      <div className="popup-form" style={popupFormStyle}>
        {notify ? <Notification message='Cập nhật người dùng thành công' type='success' onClose={handleClose}/> : null}
        <div className="wrapper" style={wrapperStyle}>
          <h2 className="mb-4 text-center">Chỉnh sửa tài khoản</h2>
          <form className="border border-3 p-4" method="POST" onClick={(e) => {
            e.stopPropagation(); // Prevent click event from propagating to the outer div
          }}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Tên hiển thị</label>
                <input
                  type="text"
                  id='displayname'
                  onChange={handleDisplaynameChange}
                  className="form-control border"
                  defaultValue={user?.Displayname}
                  placeholder="Nhập vào Tên hiển thị" required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Tiểu sử</label>
                <textarea
                  className="form-control border"
                  id="bio"
                  onChange={handleBioChange}
                  defaultValue={user?.Bio}
                  placeholder="Mô tả về người dùng"></textarea>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Địa chỉ</label>
                <input
                  type="text"
                  id='address'
                  className="form-control border"
                  onChange={handleAddressChange}
                  defaultValue={user?.Address}
                  placeholder='Địa chỉ của người dùng' required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="roleSelect">
                  Vai trò
                </label>
                <select
                  className="form-select border"
                  id="roleSelect"
                  onChange={handleRoleChange}
                  required
                >
                  <option value="" disabled>Chưa chọn</option>
                  <option value="User">Người dùng</option>
                  <option value="Admin">Quản trị viên</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="photo">
                Thay ảnh đại diện:
              </label>
              <input
                className="form-control ml-1"
                type="file"
                id="UserPhoto" name="UserPhoto"
                onChange={handlePhotoChange}
                accept="image/*" />
            </div>
            <div className="text-center">
              {isLoading ? (
                <TailSpin type="TailSpin" color="#00BFFF" height={80} width={80} />
              ) : (
                <button className="btn btn-primary btn-lg" type="button" onClick={() => handleEdit(userId)}>
                  Lưu thay đổi
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );

}
export default EditAccount;