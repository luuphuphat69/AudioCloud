import React, { useEffect, useState } from "react";
import axios from 'axios'
import SideBar from "../components/sidebar";
import EditAccount from "../components/popup/edit_account";
import CreateAccount from "../components/popup/create_account";
import {Pagination} from 'react-bootstrap';

const Users = () => {

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [userId, setUserId] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  useEffect(() => {
    axios.get('http://audiocloud.asia:8000/v1/user/getAll', {
      headers: {
        'X-API-Key': process.env.SECRET_KEY,
      },
    })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching default data:', error);
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      // If the search query is empty, do not make the API call
      return;
    }

    // If there's a search query, perform the search
    axios.get(`http://audiocloud.asia:8000/v1/user/search-user?queries=${searchQuery}`)
      .then((response) => {
        console.log(response.data.users);
        setData(response.data.users);
      })
      .catch((error) => {
        console.error('Error searching users:', error);
      });
  }, [searchQuery]);

  const handleDeleteUser = async (userId) => {
    try {
      // Ask for user confirmation
      const isConfirmed = window.confirm('Xác nhận xóa người dùng này');

      // If the user confirms, proceed with the deletion
      if (isConfirmed) {
        // Make an API request to delete the user with the provided userId
        await axios.delete(`http://audiocloud.asia:8000/v1/user/remove/${userId}`);
        window.alert('Xóa người dùng thành công');
      } else {
        window.alert('Đã hủy xóa thành công');
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('You can not delete an admin')) {
          window.alert('Không thể xóa quản trị viên.');
        }
      }
      window.alert('Đã xảy ra lỗi khi xóa. Hãy thử lại');
    }
  };

  const handleEditAccount = (userId, role) => {
    if(role === 'Admin'){
      setShowPopup(false);
      window.alert("Không thể chỉnh sửa tài khoản quản trị viên");
    } else {
      setUserId(userId);
      setShowPopup(!showPopup);
    }
  }

  const handleCreateAccount = () => {
    setShowAddPopup(!showAddPopup);
  }

  // Get current items based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  return (
    <div className="container">
      {showAddPopup ? <CreateAccount closePopup={handleCreateAccount} /> : null}
      <SideBar />
      <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
        <div class="container-fluid py-1 px-3">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
              <li class="breadcrumb-item text-sm"><a class="opacity-5 text-dark" href="">Trang chủ</a></li>
              <li class="breadcrumb-item text-sm text-dark active" aria-current="page">Người dùng</li>
            </ol>
          </nav>
          <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
            <div class="ms-md-auto pe-md-3 d-flex align-items-center">
              <div class="input-group input-group-outline">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={handleCreateAccount}>Tạo tài khoản</button>
          </div>
        </div>
      </nav>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                  <h6 className="text-white text-capitalize ps-3">Quản lý người dùng</h6>
                </div>
              </div>
              <div className="card-body px-0 pb-2">
                <div>
                </div>
                <div className="table-responsive p-0">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-secondary text-xs font-weight-bolder opacity-7">UID</th>
                        <th className="text-uppercase text-secondary text-xs font-weight-bolder opacity-7 ps-2">Tài khoản</th>
                        <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Tên hiển thị</th>
                        <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Email</th>
                        <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Vai trò</th>
                        <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Sửa</th>
                        <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr>
                          <td>
                            <p className="text-x text-secondary mb-0" key={item._id}>{item.UserId}</p>
                          </td>
                          <td>
                            <p className="text-x text-secondary mb-0" key={item._id}>{item.Account}</p>
                          </td>
                          <td className="align-middle text-center text-sm">
                            <span className="text-secondary text-x font-weight-bold" key={item._id}>{item.Displayname}</span>
                          </td>
                          <td className="align-middle text-center">
                            <span className="text-secondary text-x font-weight-bold" key={item._id}>{item.Email}</span>
                          </td>
                          <td className="align-middle text-center">
                            <span className="text-secondary text-x font-weight-bold" key={item._id}>{item.Role}</span>
                          </td>
                          <td className="align-middle">
                            <button href="" class="btn-1" data-toggle="tooltip" data-original-title="Remove user" onClick={() => handleEditAccount(item.UserId, item.Role)}>
                              Sửa
                            </button>
                          </td>
                          <td className="align-middle">
                            <button href="" class="btn-1" data-toggle="tooltip" data-original-title="Remove user" onClick={() => handleDeleteUser(item.UserId)}>
                              Xóa
                            </button>
                          </td>
                          {showPopup ? <EditAccount userId={userId} closePopup={handleEditAccount} /> : null}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 justify-content-end">
                  <Pagination>
                    {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map((page) => (
                      <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;