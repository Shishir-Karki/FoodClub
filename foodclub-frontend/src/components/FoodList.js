import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { addToCart } from '../redux/slices/cartSlice';


function FoodList() {
    const dispatch = useDispatch();
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFoodItems();
    }, []);

    const fetchFoodItems = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/food', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Food items response:', response.data); // Debug log

            if (response.data.status === "success") {
                setFoodItems(response.data.food || []);
            } else {
                toast.error('Failed to fetch food items');
            }
        } catch (error) {
            console.error('Error fetching food items:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch food items');

            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item) => {
        if (item.availableQuantity > 0) {
            dispatch(addToCart(item));
            toast.success('Added to cart!');
        } else {
            toast.error('Item out of stock!');
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('cart'); 

        navigate('/');
        toast.success('Logged out successfully');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Food Club</h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => navigate('/cart')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                        >
                            Cart
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                {foodItems.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 bg-white p-8 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">No Food Items Available</h2>
                        <p>Check back later for delicious options!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {foodItems.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                            >
                                <div className="relative">
                                    <img
                                        src={item.imgUrl || '/default-food-image.jpg'}
                                        alt={item.name}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = '/default-food-image.jpg';
                                        }}
                                    />
                                    {item.isVeg && (
                                        <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                            Veg
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                                        {item.rating > 0 && (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                                ★ {item.rating.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-900 font-bold">
                                                ${item.price.toFixed(2)}
                                                {item.discount > 0 && (
                                                    <span className="text-green-600 text-sm ml-2">
                                                        {item.discount}% off
                                                    </span>
                                                )}
                                            </p>
                                            {item.availableQuantity <= 5 && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    Only {item.availableQuantity} left!
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">
                                                Delivery in {item.deliveryTime} mins
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
                                        onClick={() => handleAddToCart(item)}
                                        disabled={item.availableQuantity === 0}
                                    >
                                        {item.availableQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FoodList;