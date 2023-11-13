import React from "react";
import {Link} from 'react-router-dom';

const SideBar = () => {
    return(
        <div
        class="sidenav sidebar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3  bg-gradient-dark"id="sidenav-main">
        <div class="sidenav-header">
          <i class="fas fa-times p-3 cursor-pointer text-white opacity-5 end-0 top-0 d-none d-xl-none"
            aria-hidden="true" id="iconSidenav"></i>
          <Link class="navbar-brand m-0" href=" https://demos.creative-tim.com/material-dashboard/pages/dashboard "
            target="_blank">
            <img src="../assets/img/logo-ct.png" class="navbar-brand-img h-100" alt="main_logo"/>
            <span class="ms-1 font-weight-bold text-white">AudioCloud Dashboard</span>
          </Link>
        </div>
        <hr class="horizontal light mt-0 mb-2"/>
        <div class="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
          <ul class="navbar-nav">
            <li class="nav-item mt-3">
              <h6 class="text-uppercase text-xs text-white font-weight-bolder">Quản lý người dùng</h6>
            </li>
            <li class="nav-item">
              <Link class="nav-link text-white " to="/user-management">
                <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i class="material-icons opacity-10">dashboard</i>
                </div>
                <span class="nav-link-text ms-1">Người dùng</span>
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link text-white" to="/audio-management">
                <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i class="material-icons opacity-10">table_view</i>
                </div>
                <span class="nav-link-text ms-1">Bài hát</span>
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link text-white " to="../pages/billing.html">
                <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i class="material-icons opacity-10">receipt_long</i>
                </div>
                <span class="nav-link-text ms-1">Hóa đơn</span>
              </Link>
            </li>
            <li class="nav-item mt-3">
              <h6 class="text-uppercase text-xs text-white font-weight-bolder">tài khoản cá nhân</h6>
            </li>
            <li class="nav-item">
              <Link class="nav-link text-white " href="/profile">
                <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i class="material-icons opacity-10">person</i>
                </div>
                <span class="nav-link-text ms-1">Tài khoản</span>
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link text-white " href="../pages/sign-in.html">
                <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i class="material-icons opacity-10">login</i>
                </div>
                <span class="nav-link-text ms-1">Đăng nhập</span>
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link text-white " to="/sign-up">
                <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i class="material-icons opacity-10">assignment</i>
                </div>
                <span class="nav-link-text ms-1">Đăng ký</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
}
export default SideBar;