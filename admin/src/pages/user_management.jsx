import React, { useEffect, useState } from "react";
import axios from 'axios'

const Users = () => {
  const apiEndpoint = 'http://localhost:8000/v1/user/getAll';
  const [data, setData] = useState([]);
  useEffect(() => {
    // Fetch data from the API endpoint
    axios.get(apiEndpoint)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [apiEndpoint]);

  const handleDeleteUser = async (userId) => {
    try {
      // Make an API request to delete the user with the provided userId
      await axios.delete(`http://localhost:8000/v1/user/removeUser/${userId}`); // params
      window.alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      window.alert('Error deleting user. Please try again.');
    }
  };

  return (
    <div>
      <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
        <div class="container-fluid py-1 px-3">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
              <li class="breadcrumb-item text-sm"><a class="opacity-5 text-dark" href="">Pages</a></li>
              <li class="breadcrumb-item text-sm text-dark active" aria-current="page">Tables</li>
            </ol>
          </nav>
          <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
            <div class="ms-md-auto pe-md-3 d-flex align-items-center">
              <div class="input-group input-group-outline">
                <input type="text" class="form-control" placeholder="Type here" />
              </div>
            </div>
            <ul class="navbar-nav">
              <li class="nav-item d-flex align-items-center">
                <a href="../pages/sign-in.html" class="nav-link text-body font-weight-bold px-0">
                  <i class="fa fa-user me-sm-1"></i>
                  <span class="d-sm-inline d-none">Sign In</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                  <h6 className="text-white text-capitalize ps-3">Users table</h6>
                </div>
              </div>
              <div className="card-body px-0 pb-2">
                <div className="table-responsive p-0">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">User ID</th>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">User Account</th>
                        <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Displayname</th>
                        <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Email</th>
                        <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Edit</th>
                        <th className="text-center text-uppercase text-secondary text-xs font-weight-bolder opacity-7">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item) => (
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
                        <td className="align-middle">
                          <a href="" class="btn-1" data-toggle="tooltip" data-original-title="Edit user">
                            Edit
                          </a>
                        </td>
                        <td className="align-middle">
                          <button href="" class="btn-1" data-toggle="tooltip" data-original-title="Remove user" onClick={() => handleDeleteUser(item.UserId)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
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