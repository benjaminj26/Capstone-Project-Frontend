import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    retypePassword: '',
    name: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, retypePassword, name } = formData;

    if (password !== retypePassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must contain at least one special character, one number, and one capital letter.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9598/auth/register', {
        username,
        email,
        password,
        name
      });

      if (response.data) {
        alert('Registration successful!');
        localStorage.setItem('token', response.data);
        navigate('/');
      }
    } catch (error) {
      setError('An error occurred during registration. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text text-center mb-6">
          Eventio Registration
        </h2>

        {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
        {success && <div className="mb-4 text-green-600 font-medium">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {['username', 'email', 'password', 'retypePassword', 'name'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                {field === 'retypePassword' ? 'Retype Password' : field}
              </label>
              <input
                type={field.includes('password') ? 'password' : 'text'}
                name={field}
                id={field}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserRegistration;
