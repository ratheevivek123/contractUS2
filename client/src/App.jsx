import React from 'react';
import Register from './pages/register.jsx';
import Layout from './layout/Adminlayout.jsx';
import Login from './pages/Login.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Users from './pages/users.jsx';
import Projects from './pages/Projects.jsx';
import About from './pages/About.jsx';
import Contractors from './pages/Contractors.jsx';
import Suppliers from './pages/Suppliers.jsx';
import Messages from './pages/Messages.jsx';
import UserDashboard from './layout/Userdash.jsx';
import UserHome from './users/Userpages/UserHome.jsx';
import FindContractor from './users/Userpages/FindContractor.jsx';
import UserBookings from './users/Userpages/UserBookings.jsx';
import UserProfile from './users/Userpages/UserProfile.jsx';
import Contractorslayout from './layout/Contractorslayout.jsx';
import ContractorHome from './contractors/ContractorsHome.jsx';
import ContractorBookings from './contractors/ContractorBookings.jsx';
import ContractorsService from './contractors/ContractorsService.jsx';
import ContractorProfile from './contractors/ContractorProfile.jsx';
import LandingPage from './landingcontrols/LandingPage.jsx';
import UserRegister from './landingcontrols/UserRegistration.jsx';
import UserLogin from './landingcontrols/UserLogin.jsx';
import ContractorRegister from './landingcontrols/ContractorRegistration.jsx';
import ContractorLogin from './landingcontrols/ContractorLogin.jsx';
import BookingDetails from './users/Userpages/BookingDetails.jsx';
import { UserProvider } from './context/UserContext.jsx';
import ContractorDetails from './users/Userpages/ContractorDetails.jsx';
import AdminLogin from './pages/Adminlogin.jsx';

const App = () => {
  return (
    <Router>
      
       
        <div className="p-4 w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />


               <Route path="/user-register" element={<UserRegister />} />
              <Route path="/user-login" element={<UserLogin />} />

              <Route path="/contractor-register" element={<ContractorRegister />} />
             <Route path="/contractor-login" element={<ContractorLogin />} />

             <Route path="/Admin/login" element={<AdminLogin />} />
              <Route path="/Admin/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="users" element={<Users />} />
             <Route path="about" element={<About />} />
             <Route path="projects" element={<Projects />} />
              <Route path="leads" element={<Messages/>} />
              <Route path="suppliers" element={<Suppliers/>} />
               <Route path="contractors" element={<Contractors />} />
               </Route>
             
             

               
               <Route path="/user" element={<UserDashboard />}>
                <Route index element={<UserHome />} />
                <Route path="find-contractor" element={<FindContractor />} />
               <Route path="bookings" element={<UserBookings />} />
                 <Route path="bookings/:bookingId" element={<BookingDetails />} />
                 <Route path="contractor/:id" element={<ContractorDetails />} />
               <Route path="profile" element={<UserProfile />} />
             </Route>
                
               


            
             <Route path="/Contractor" element={<Contractorslayout />}>
                <Route index element={<ContractorHome />} />
                <Route path="bookings" element={<ContractorBookings/>} />
               <Route path="services" element={<ContractorsService />} />
               <Route path="profile" element={<ContractorProfile />} />
             </Route>
             </Routes>




         
        </div>
      
    </Router>
  );
};

export default App;
