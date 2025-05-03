import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import { CalendarIcon, MapPinIcon, UserIcon, TagIcon } from 'lucide-react';
import axios from 'axios';

const EventCreationPage = () => {
  const [eventDetails, setEventDetails] = useState({
    eventName: '',
    host: '',
    eventType: '',
    eventLocation: '',
    eventDate: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const username = localStorage.getItem('username');
        const response = await axios.get(`http://localhost:9598/user/getUser`, {
          params: { username }
        });
        const userData = response.data;
        setEventDetails(prevDetails => ({
          ...prevDetails,
          host: userData.name
        }));
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event details to be passed:', eventDetails);
    navigate('/venues', { state: { eventDetails } });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-sky-200 p-8">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Create Your Event</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Name Field */}
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    id="eventName"
                    name="eventName"
                    value={eventDetails.eventName}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter event name"
                    required
                  />
                </div>
              </div>

              {/* Host Name Field */}
              <div>
                <label htmlFor="host" className="block text-sm font-medium text-gray-700">Host</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    id="host"
                    name="host"
                    value={eventDetails.host}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter host name"
                    required
                  />
                </div>
              </div>

              {/* Event Type Field */}
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">Event Type</label>
                <select
                  id="eventType"
                  name="eventType"
                  value={eventDetails.eventType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="wedding">Wedding</option>
                  <option value="conference">Conference</option>
                  <option value="party">Party</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>

              {/* Event Location Field */}
              <div>
                <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700">Event Location</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    id="eventLocation"
                    name="eventLocation"
                    value={eventDetails.eventLocation}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter event location"
                    required
                  />
                </div>
              </div>

              {/* Event Date Field */}
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">Event Date</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={eventDetails.eventDate}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventCreationPage;
