import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

function Header({ title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  const { items } = useSelector((state) => state.cart);

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/');
    toast.success('Logged out successfully');
  };

  const isCustomer = userRole && userRole.toUpperCase() === 'CUSTOMER';
  const isCartPage = location.pathname === '/cart';

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/food')}
        >
          <div className="text-3xl font-bold text-orange-500">
            FOOD<span className="text-gray-800">CLUB</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {userRole && (
            <>
              {isCustomer && !isCartPage && (
                <button
                  onClick={() => navigate('/cart')}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200 relative"
                >
                  Cart
                  {items?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;