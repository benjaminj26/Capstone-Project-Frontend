import React, { useState, useEffect } from 'react';
import AdminNavBar from '../components/AdminNavBar';
import AdminSideBar from '../components/AdminSideBar';
import axios from 'axios'; // For making API calls

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    name: '',
  });
  // const [clientId,setClientId]=useState('');
console.log(localStorage);

  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [editDetails, setEditDetails] = useState(userDetails); // Track edited data

  useEffect(() => {
    // Get the username from local storage
    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
      // Fetch user details from the backend
      axios.get(`http://localhost:9598/user/getUser?username=${storedUsername}`)
        .then(response => {
          if (response.data) {

          // Store clientId in localStorage for future use
            localStorage.setItem('clientId', response.data.id);

            setUserDetails({
              username: response.data.username,
              email: response.data.email,
              name: response.data.name,
            });
            setEditDetails({
              username: response.data.username,
              email: response.data.email,
              name: response.data.name,
            });
          } else {
            alert('User not found');
          }
          // setClientId=response.id;
          // console.log(clientId);
          // console.log(response);
        })
        .catch(error => {
          console.error('There was an error fetching the user details!', error);
          alert('Failed to fetch user details.');
        });
    } else {
      alert('No username found in local storage');
    }
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setEditDetails({ ...editDetails, [e.target.name]: e.target.value });
  };

  // Handle saving the updated details
  const handleSave = () => {
    axios.put(`http://localhost:9598/user/profile/${localStorage.clientId}`, editDetails)
      .then(response => {
        if (response.data) {
          alert('Profile updated successfully!');
          setUserDetails(editDetails); // Update displayed details
          setIsEditing(false); // Exit editing mode
        }
      })
      .catch(error => {
        console.error('Error updating user details', error);
        alert('Failed to update user details.');
      });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSideBar />
      <div className="flex-1">
        <AdminNavBar />
        <div className="bg-white p-4 rounded-lg shadow-lg mt-4 mx-4">
          {/* User Details Display */}
          <div className="p-10 max-w-3xl mx-auto h-screen">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">User Profile</h2>

              {/* Toggle between edit and display mode */}
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-lg font-medium text-gray-700">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={editDetails.username}
                      onChange={handleChange}
                      className="text-xl text-gray-800 border border-gray-300 rounded-md p-2 w-full"
                    />
                  ) : (
                    <p className="text-xl text-gray-800">{userDetails.username}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-lg font-medium text-gray-700">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editDetails.name}
                      onChange={handleChange}
                      className="text-xl text-gray-800 border border-gray-300 rounded-md p-2 w-full"
                    />
                  ) : (
                    <p className="text-xl text-gray-800">{userDetails.name}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-lg font-medium text-gray-700">Email</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="email"
                      value={editDetails.email}
                      onChange={handleChange}
                      className="text-xl text-gray-800 border border-gray-300 rounded-md p-2 w-full"
                    />
                  ) : (
                    <p className="text-xl text-gray-800">{userDetails.email}</p>
                  )}
                </div>

                {/* Buttons to toggle editing and save changes */}
                {isEditing ? (
                  <div className="space-x-4">
                    <button
                      onClick={handleSave}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
