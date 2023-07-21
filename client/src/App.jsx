
import { Route, Routes } from 'react-router-dom';
import './App.css'
import IndexPage from './pages/IndexPage.jsx';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import RegisterBPage from './pages/RegisterBPage';

import axios from 'axios';
import AccountPage from './pages/AccountPage';

axios.defaults.baseURL = 'http://localhost:4000';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registerB" element={<RegisterBPage />} />
        <Route path='/account' element={<AccountPage />} />
      </Route>      
    </Routes>
    
  )
}

export default App
