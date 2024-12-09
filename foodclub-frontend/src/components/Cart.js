import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('cart'); 

    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleQuantityChange = (id, newQuantity, availableQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(id));
      return;
    }
    if (newQuantity > availableQuantity) {
      toast.error(`Only ${availableQuantity} items available`);
      return;
    }
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Shopping Cart</h1>
            <div>
              <button
                onClick={() => navigate('/food')}
                className="text-blue-500 hover:text-blue-700 mr-4"
              >
                Home
              </button>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Your Cart</h2>
          <p className="text-center text-gray-600">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Shopping Cart</h1>
          <div>
            <button
              onClick={() => navigate('/food')}
              className="text-blue-500 hover:text-blue-700 mr-4"
            >
              Home
            </button>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
          <button
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-700"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.imgUrl || '/default-food-image.jpg'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/default-food-image.jpg';
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded">
                  <button
                    className="px-3 py-1 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1, item.availableQuantity)}
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{item.quantity}</span>
                  <button
                    className="px-3 py-1 hover:bg-gray-100"
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1, item.availableQuantity)}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold">₨{totalAmount.toFixed(2)}</span>
          </div>
          <button
            className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
            onClick={() => toast.success('Checkout functionality coming soon!')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
