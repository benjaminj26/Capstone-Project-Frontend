import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; // Left Sidebar
import NavBar from '../components/NavBar';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [clientId, setClientId] = useState(null);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await axios.get('http://localhost:9598/user/getUser', {
          params: { username }
        });
        setClientId(response.data.id);
      } catch (error) {
        console.error('Error fetching client ID:', error);
      }
    };

    if (username) {
      fetchClientId();
    }
  }, [username]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (clientId) {
        try {
          const response = await axios.get('http://localhost:9598/user/events', {
            params: { userId: clientId }
          });
          setEvents(response.data);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      }
    };

    fetchEvents();
  }, [clientId]);

  const handleEventClick = (eventId) => {
    navigate(`/details/${eventId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
      <NavBar />
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto bg-gray-100">
          {/* Events Section */}
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl cursor-pointer transition duration-300"
                  onClick={() => handleEventClick(event.id)}
                >
                  <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                  <p className="text-gray-600 text-sm">{event.type} on {event.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
