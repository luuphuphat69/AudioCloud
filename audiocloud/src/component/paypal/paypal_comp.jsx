import { PayPalButtons } from '@paypal/react-paypal-js';
import { useState, useEffect } from 'react';
import Notification from '../notify/notify_comp';
import axios from 'axios';
import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
const PaymentComponent = ({ userId, type, amount, closePopup }) => {

  const [notify, setNotify] = useState(false);
  const navigate = useNavigate();

  const cookies = new Cookies();
  const CookiesToken = cookies.get('token');

  const handleUpdateBilling = async () => {
    try {
      await axios.post(`http://audiocloud.asia:8000/v1/billing/create-bill/${userId}`);
    } catch (err) {
      console.log(err);
    }
  }
  const handleUpdatePro = async () => {
    try {
      const user = jwt(CookiesToken);
      if (user === null) {
        window.alert("Xin vui lòng đăng nhập");
        navigate('/home');
      }
      if (type === 'Artist') {
        await axios.put(`http://audiocloud.asia:8000/v1/user/update-artist/${user.userId}`);
      }
      if (type === 'Listener') {
        await axios.put(`http://audiocloud.asia:8000/v1/user/update-pro/${user.userId}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createOrder = (data, actions) => {
    // Define the order to be created
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount, // The amount to be charged
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    // Capture the funds when the customer approves the payment
    setNotify(true);
    handleUpdatePro();
    handleUpdateBilling();
    return actions.order.capture();
  };

  return (
    <div className="overlay" onClick={closePopup}>
      <div className="container" style={{ height: '450px', overflow: 'auto' }}>
        <div className="wrapper p-5">
          <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
          {notify ? <Notification type='success' onClose={() => setNotify(false)} message='Đã mua thành công' /> : null}
        </div>
      </div>
    </div>

  );
}
export default PaymentComponent;