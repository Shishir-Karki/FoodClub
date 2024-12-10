import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://foodclub-2.onrender.com/auth/signup', {
        username: formData.username,
        email: formData.email.toLowerCase(),
        password: formData.password,
        phone: formData.phone
      });

      if (response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        toast.success('Signup successful!');
        navigate('/food');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('User already exists with this email');
      } else {
        console.error('Server error:', error.response?.data);
        toast.error('Server error. Please try again later.');
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQMqrku3owmnGlApPA0sLLl_W2I9plWMBKNA&s')`
      }}
    >
      <div className="min-h-screen bg-black/60 flex justify-center items-center">
        <div className="bg-white/90 p-8 rounded-lg shadow-md w-96 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              ← Back
            </button>
            <h2 className="text-3xl font-bold text-gray-800">Sign Up</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              minLength="5"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 transition duration-200"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;