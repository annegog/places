
import { Route, Routes } from 'react-router-dom';
import './App.css'
import IndexPage from './pages/IndexPage.jsx';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';

import axios from 'axios';
import AccountPage from './pages/AccountPage';
import { UserContextProvider } from './UserContext';
import PlacesPage from './pages/PlacesPage';
import PlacesFormPage from './pages/PlacesFormPage';
import ProfilePage from './pages/ProfilePage';
import PlacePage from './pages/PLacePage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';
import { AdminContextProvider } from './AdminContext';
import AdminPage from './pages/AdminPage';
import UsersPage from './pages/UsersPage';
import HostsPage from './pages/HostsPage';
import TenantsPage from './pages/TenantsPage';



axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {

  return (
    <UserContextProvider> 
       <AdminContextProvider>
        <Routes>
       
          <Route path="/" element={<Layout />}>
            <Route index element={ <IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={ <AccountPage />} /> 
            <Route path="/place/:id" element={<PlacePage />} />

            // Bookings - host and tenent access
            <Route path="/account/profile" element={<ProfilePage />} />
            <Route path="/account/bookings" element={<BookingsPage />} />
            <Route path="/account/bookings/:id" element={<BookingPage/>} />

            // Places Page - host access
            <Route path="/account/places" element={<PlacesPage />} />
            <Route path="/account/places/new" element={<PlacesFormPage />} />
            <Route path="/account/places/:id" element={<PlacesFormPage />} />
            
            // Admins Pages - Admin access ONLY
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            {/* <Route path="/account/places/:id" element={<PlacesFormPage />} */}
            <Route path="/admin/hosts" element={<HostsPage />} />
            {/*  */}
            <Route path="/admin/tenants" element={<TenantsPage />} />
            {/*  */}
          
          </Route> 
            
        </Routes>
      </AdminContextProvider> 
    </UserContextProvider>
    
  )
}

export default App
