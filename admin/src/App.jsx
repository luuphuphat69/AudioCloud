import { BrowserRouter as Router, Routes, Route }from 'react-router-dom';
import './App.css'

import Users from './pages/user_management'

function App() {

  return (
  <Router>
    <Routes>
        <Route path='/usermanagement' element={<Users />} />
    </Routes>
  </Router>
  );
}

export default App
