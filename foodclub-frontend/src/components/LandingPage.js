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
      <div className="min-h-screen bg-black/60 flex flex-col justify-center items-center">
        <div className="text-center text-white mb-10">
          <h1 className="text-6xl font-bold mb-4">Welcome to FoodClub</h1>
          <p className="text-xl mb-8">Your favorite meals, delivered to your doorstep</p>
        </div>

        <div className="space-x-6">
          <button
            onClick={() => navigate('/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white hover:bg-gray-100 text-orange-500 px-8 py-3 rounded-lg text-lg font-semibold transition duration-300 transform hover:scale-105"
          >
            Sign Up
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          <div className="bg-white/90 p-6 rounded-lg shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-3 text-orange-500">Wide Selection</h3>
            <p className="text-gray-700">Choose from hundreds of restaurants and cuisines.</p>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-3 text-orange-500">Fast Delivery</h3>
            <p className="text-gray-700">Get your food delivered quickly and efficiently.</p>
          </div>
          <div className="bg-white/90 p-6 rounded-lg shadow-lg backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-3 text-orange-500">Best Prices</h3>
            <p className="text-gray-700">Enjoy competitive prices and regular discounts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;