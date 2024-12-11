import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQMqrku3owmnGlApPA0sLLl_W2I9plWMBKNA&s')`
      }}
    >
      <div className="min-h-screen bg-black/60 flex flex-col justify-center items-center px-4">
        {/* Header Section */}
        <div className="text-center text-white mb-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to FoodClub</h1>
          <p className="text-lg md:text-xl mb-8">Your favorite meals, delivered to your doorstep</p>
        </div>

        {/* Buttons Section */}
        <div className="space-y-4 md:space-x-6 md:space-y-0 flex flex-col md:flex-row">
          <button
            onClick={() => navigate('/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 md:px-8 md:py-3 rounded-lg text-lg font-semibold transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white hover:bg-gray-100 text-orange-500 px-6 py-3 md:px-8 md:py-3 rounded-lg text-lg font-semibold transition duration-300 transform hover:scale-105"
          >
            Sign Up
          </button>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/90 p-6 rounded-lg shadow-lg backdrop-blur-sm text-center">
            <h3 className="text-lg md:text-xl font-bold mb-3 text-orange-500">Wide Selection</h3>
            <p className="text-gray-700 text-sm md:text-base">Choose from various restaurants and cuisines.</p>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-lg backdrop-blur-sm text-center">
            <h3 className="text-lg md:text-xl font-bold mb-3 text-orange-500">Fast Delivery</h3>
            <p className="text-gray-700 text-sm md:text-base">Get your food delivered quickly and efficiently.</p>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-lg backdrop-blur-sm text-center">
            <h3 className="text-lg md:text-xl font-bold mb-3 text-orange-500">Best Prices</h3>
            <p className="text-gray-700 text-sm md:text-base">Enjoy competitive prices and regular discounts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;