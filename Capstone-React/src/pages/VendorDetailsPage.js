import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // To get vendorId from URL
import AdminNavBar from '../components/AdminNavBar';
import AdminSideBar from '../components/AdminSideBar';

function VendorDetailsPage() {
  const { vendorId } = useParams(); // Get vendorId from the route params
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch vendor details
  const fetchVendorDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:9598/vendor/${vendorId}`);
      setVendor(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      setError('Failed to fetch vendor details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorDetails();
  }, [vendorId]); // Refetch if vendorId changes

  if (loading) {
    return <p>Loading vendor details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <AdminNavBar />

        {/* Vendor Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6 mx-6">
          <h3 className="text-xl font-semibold mb-4">Vendor Details</h3>
          {vendor ? (
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-bold">Name:</h4>
                <p>{vendor.vendorName}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-bold">Email:</h4>
                <p>{vendor.vendorEmail}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-bold">Phone:</h4>
                <p>{vendor.vendorPhone}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-bold">Location:</h4>
                <p>{vendor.vendorLocation}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-bold">Type:</h4>
                <p>{vendor.type}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-bold">Rate:</h4>
                <p>{vendor.rate}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-lg font-bold">Description:</h4>
                <p>{vendor.description}</p>
              </div>
              {/* Add more fields as needed */}
            </div>
          ) : (
            <p>Vendor not found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorDetailsPage;
