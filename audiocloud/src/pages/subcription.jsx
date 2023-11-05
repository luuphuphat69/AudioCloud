import React, { useState, useEffect } from "react";
import PayPalProviderComponent from "../component/paypal/paypal_provider";
import PaymentComponent from "../component/paypal/paypal_comp";
import NavbarLoggedOut from '../component/navbar/navbar_loggedout';
import NavbarLoggedIn from '../component/navbar/navbar_loggedin';
import axios from "axios";
import jwt from 'jwt-decode';

const Subcription = () => {

  const [showPayment, setShowPayment] = useState(false);
  const [type, setType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the token when the component mounts
    const fetchToken = async () => {
        try {
            const response = await axios.get('http://54.206.75.221:8000/get-cookies', { withCredentials: true });
            const receivedToken = response.data;
            setToken(receivedToken);
            checkLoginStatus();

            const _user = jwt(token);
            const userDataResponse = await axios.get(`http://54.206.75.221:8000/v1/user/get-info/${_user.userId}`, { withCredentials: true });
            setUser(userDataResponse.data);
        } catch (error) {
            // console.error('Error fetching token:', error);
        }
    };
    fetchToken();
}, [isLoggedIn]);

  const checkLoginStatus = () => {
    // Check if the token exists and update the login status
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  const handleSubmit = (type) => {
    setShowPayment(true);
    setType(type);
  }
  const handleClose = () => {
    setShowPayment(false);
  }
  return (
    <PayPalProviderComponent>
      <section>
      {isLoggedIn ? <NavbarLoggedIn /> : <NavbarLoggedOut />}
        <div class="content p-5">
          <div class="basic box1">
            <h2 class="title">Miễn phí</h2>
            <div class="view">
              <div class="icon">
                <img src="https://i.postimg.cc/2jcfMcf4/hot-air-balloon.png" alt="hot-air-balloon" />
              </div>
              <div class="cost">
                <p class="amount">$0</p>
                <p class="detail">mỗi tài khoản</p>
              </div>
            </div>
            <div class="description">
              <ul className="ul1">
                <li className="li1">Đăng nhạc (giới hạn 20 bài)</li>
                <li className="li1">Nghe nhạc .mp3</li>
                <li className="li1">Tải nhạc</li>
              </ul>
            </div>
          </div>

          <div class="standard box1">
            <h2 class="title">Người nghe</h2>
            <div class="view">
              <div class="icon">
                <img src="https://i.postimg.cc/DzrTN72Z/airplane.png" alt="airplane" />
              </div>
              <div class="cost">
                <p class="amount">$50</p>
                <p class="detail">mỗi tài khoản/ năm</p>
              </div>
            </div>
            <div class="description">
              <ul className="ul1">
                <li className="li1">Đăng nhạc không giới hạn</li>
                <li className="li1">Nghe nhạc chất lượng cao.</li>
                <li className="li1">Tải nhạc chất lượng cao.</li>
                <li className="li1">Trải nghiệm không quảng cáo</li>
                <li className="li1">Tích hợp công cụ DJ</li>
                <li className="li1">Lưu bài nhạc không giới hạn để phát lại ngoại tuyến</li>
              </ul>
            </div>
            {user?.isPro ? <button type="submit" style={{ color: "#000" }} disabled='true'>ĐÃ MUA</button> 
            : <button type="submit" style={{ color: "#000" }} onClick={() => handleSubmit('Listener')}>MUA NGAY</button>}
          </div>
          <div class="business box1" style={{height:"769px"}}>
            <h2 class="title">Nghệ sĩ</h2>
            <div class="view">
              <div class="icon">
                <img src="https://i.postimg.cc/wvFd6FRY/startup.png" alt="startup" />
              </div>
              <div class="cost">
                <p class="amount">$199</p>
                <p class="detail">Mỗi tài khoản/ năm</p>
              </div>
            </div>
            <div class="description">
              <ul className="ul1">
                <li className="li1">Đăng tải không giới hạn</li>
                <li className="li1">Lên tới 3 giờ tải lên bản nhạc</li>
                <li className="li1">Chia sẻ các bản nhạc riêng tư với cộng tác</li>
                <li className="li1">Đăng các bản nhạc công khai và lắng nghe ý kiến từ người hâm mộ</li>
                <li className="li1">Thông tin chi tiết về người hâm mộ</li>
                <li className="li1">Công cụ quản lý theo dõi</li>
                <li className="li1">Kiểm soát hồ sơ tùy chỉnh bao gồm cả track spotlight</li>
                <li className="li1">Huy hiệu hồ sơ cao cấp</li>
                <li className="li1">Miễn phí 3 lần dịch vụ Mastering mỗi tháng</li>
                <li className="li1">Công cụ quản lý theo dõi</li>
              </ul>
            </div>
            {user?.isArtist ? <button type="submit" style={{ color: "#000" }} disabled='true'>ĐÃ MUA</button>
            :<button type="submit" onClick={() => handleSubmit('Artist')} style={{ color: "#000" }}>MUA NGAY</button>}
          </div>
        </div>
        {showPayment && type === 'Artist' ? <PaymentComponent type='Artist' amount='199.00' closePopup={handleClose} />
          : showPayment && type === 'Listener' ? <PaymentComponent type='Listener' amount='50.00' closePopup={handleClose} /> : null}
      </section>
    </PayPalProviderComponent>
  );
}
export default Subcription;