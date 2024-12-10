import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://foodclub-2.onrender.com/auth/login', { email, password });
      
      
      console.log('Login response:', response.data);
      
     
      const userRole = response.data.user.role.toUpperCase();
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', userRole);
      toast.success('Login successful!');
      

      
      if (userRole === 'ADMIN' || userRole === 'SUPERADMIN') {
        navigate('/admin');
      } else {
        navigate('/food');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
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
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 transition duration-200"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;