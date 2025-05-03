import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import axios from 'axios';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    name: '',
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
      axios.get(`http://localhost:9598/user/getUser?username=${storedUsername}`)
        .then(response => {
          if (response.data) {
            setUserDetails({
              username: response.data.username,
              email: response.data.email,
              name: response.data.name,
            });
          } else {
            alert('User not found');
          }
        })
        .catch(error => {
          console.error('There was an error fetching the user details!', error);
          alert('Failed to fetch user details.');
        });
    } else {
      alert('No username found in local storage');
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Profile Content Area */}
        <div className="flex-1 p-8 overflow-auto bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Profile</h2>

            {/* User Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-md font-medium text-gray-700">Username</h3>
                <p className="text-sm text-gray-800 mt-1">{userDetails.username}</p>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-md font-medium text-gray-700">Name</h3>
                <p className="text-sm text-gray-800 mt-1">{userDetails.name}</p>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-md font-medium text-gray-700">Email</h3>
                <p className="text-sm text-gray-800 mt-1">{userDetails.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
