import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const PayPalProviderComponent = ({ children }) => {
  return (
    <PayPalScriptProvider options={{ "client-id": 'AfV0TMi0dCALCnEu6TjHt3YWn72mD13RFSSAfGFn0IUrHmFo08tUM367-xXulyMgzKGPRANC927f0TIH' }}>
      {children}
    </PayPalScriptProvider>
  );
}
export default PayPalProviderComponent;
