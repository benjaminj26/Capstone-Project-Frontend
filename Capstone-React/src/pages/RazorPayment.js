import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RazorpayPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  useEffect(() => {
    const { eventId, budget } = location.state || {};
    console.log('Received eventId:', eventId);
    console.log('Received budget:', budget);

    if (!eventId || !budget) {
      setError('Event details are missing. Please go back and try again.');
      setLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded');
      setIsScriptLoaded(true);
    };
    script.onerror = () => console.error('Failed to load Razorpay script');
    document.body.appendChild(script);

    // Set amount from budget when component mounts
    if (budget) {
      setAmount(budget.toString());
    }

    return () => {
      document.body.removeChild(script);
    };
  }, [location.state]);

  
  

  const handlePayment = () => {
    if (!isScriptLoaded) {
      alert('Razorpay script not loaded yet. Please try again in a moment.');
      return;
    }

    const amountInPaise = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const options = {
      key: 'rzp_test_6iaGWu6uNTCk1q', // Replace with your Razorpay key
      amount: amountInPaise,
      currency: 'INR',
      name: 'Eventio',
      description: 'Event Payment',
      image: 'your_logo_url', // Replace with your logo URL
      handler: async function (response) {
        
        alert('Payment Successful! Payment ID: ' + response.razorpay_payment_id);
        // console.log('eventId', eventId);
        try {
          const { eventId, budget } = location.state || {};
          console.log('try loop xd eventId', eventId);
          await axios.put(`http://localhost:9598/api/event/paymetUpdate/${eventId}`);
          console.log('Payment status updated successfully');
          navigate(`/details/${eventId}`);
        } catch (error) {
          console.error('Error updating payment status:', error);
        }
      },
      prefill: {
        name: name,
        email: email
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-600 p-6 text-center">
        <h2 className="text-2xl font-bold text-white">Razorpay Payment</h2>
      </div>
      <div className="p-8 space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="amount" className="block text-lg font-medium text-gray-700">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            readOnly
          />
        </div>
      </div>
      <div className="p-4 bg-gray-100 text-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
          onClick={handlePayment}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default RazorpayPayment;