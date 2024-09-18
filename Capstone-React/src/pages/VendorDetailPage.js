import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import AdminNavBar from '../components/AdminNavBar';
import AdminSideBar from '../components/AdminSideBar';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function VendorDetailsPage() {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchVendorDetails();
  }, [vendorId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading vendor details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSideBar />
      <div className="flex-1 overflow-auto">
        <AdminNavBar />
        <main className="p-6">
          {vendor ? (
            <div>
              <h1 className="text-3xl font-bold mb-6">{vendor.vendorName}</h1>
              
              <div className="flex flex-col lg:flex-row gap-6 mb-6">
                {/* Vendor Information */}
                <div className="flex flex-col lg:flex-row w-full">
      <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-6 mb-4 lg:mb-0 lg:mr-4">
        <h2 className="text-xl font-semibold mb-4">Vendor Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Email:</strong> {vendor.vendorEmail}</p>
            <p><strong>Phone:</strong> {vendor.vendorPhone}</p>
            <p><strong>Location:</strong> {vendor.vendorLocation}</p>
          </div>
          <div>
            <p><strong>Type:</strong> {vendor.type}</p>
            <p><strong>Rate:</strong> {vendor.rate}</p>
            <p><strong>Rating:</strong> {vendor.rating || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Vendor Images</h2>
        {vendor.images && vendor.images.length > 0 ? (
          vendor.images.length === 1 ? (
            <img
              src={vendor.images[0]}
              alt="Vendor"
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          ) : (
            <Slider {...sliderSettings}>
              {vendor.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Vendor image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            </Slider>
          )
        ) : (
          <p>No images available.</p>
        )}
      </div>
    </div>

                
              </div>

              {/* Services Offered */}
              <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
                {vendor.services && vendor.services.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {vendor.services.map((service, index) => (
                      <li key={index} className="mb-2">{service}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No services listed.</p>
                )}
              </div>

              {/* Description */}
              <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p>{vendor.description || 'No description available.'}</p>
              </div>

              {/* Customer Reviews */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                {vendor.reviews && vendor.reviews.length > 0 ? (
                  vendor.reviews.map((review, index) => (
                    <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                      <div className="flex items-center mb-2">
                        <span className="font-bold mr-2">Rating: {review.rating}</span>
                      </div>
                      <p className="mb-1">{review.comment}</p>
                      <p className="text-sm text-gray-500">- {review.author}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews available.</p>
                )}
              </div>
            </div>
          ) : (
            <p>Vendor not found</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default VendorDetailsPage;