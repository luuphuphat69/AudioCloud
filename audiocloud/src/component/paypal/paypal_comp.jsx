import { PayPalButtons } from '@paypal/react-paypal-js';
import { useState, useEffect } from 'react';
import Notification from '../notify/notify_comp';
import axios from 'axios';
import jwt from 'jwt-decode';
const PaymentComponent = ({type, amount, closePopup}) => {

  const [notify, setNotify] = useState(false);

  const handleUpdatePro = async () => {
    try {
        const response = await axios.get('http://54.206.75.221:8000/get-cookies', { withCredentials: true });
        const receivedToken = response.data;
        const user = jwt(receivedToken);
        if(type === 'Artist'){
          await axios.put(`http://54.206.75.221:8000/v1/user/update-artist/${user.userId}`);
        }
        if(type === 'Listener'){
          await axios.put(`http://54.206.75.221:8000/v1/user/update-pro/${user.userId}`);
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
    return actions.order.capture();
  };

  return (
<div className="overlay" onClick={closePopup}>
  <div className="container" style={{ height: '450px', overflow: 'auto' }}>
    <div className="wrapper p-5">
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
      {notify ? <Notification type='success' onClose={() => setNotify(false)} message='Đã mua thành công'/> : null}
    </div>
  </div>
</div>

  );
}
export default PaymentComponent;