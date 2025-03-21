import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { addToCart } from '../redux/slices/cartSlice';

function FoodList() {
    const dispatch = useDispatch();
    const [foodItems, setFoodItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const isAdminUser = userRole && (userRole.toUpperCase() === 'ADMIN' || userRole.toUpperCase() === 'SUPERADMIN');


    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [maxPrice, setMaxPrice] = useState(2000);
    const [isVegOnly, setIsVegOnly] = useState(false);

    useEffect(() => {
        fetchFoodItems();
    }, []);

    useEffect(() => {
        filterFoodItems();
    }, [searchQuery, selectedCategory, maxPrice, isVegOnly, foodItems]);

    const filterFoodItems = () => {
        let filtered = [...foodItems];

        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        filtered = filtered.filter(item => item.price <= maxPrice);

        if (isVegOnly) {
            filtered = filtered.filter(item => item.isVeg);
        }

        setFilteredItems(filtered);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setMaxPrice(2000);
        setIsVegOnly(false);
    };

    const fetchFoodItems = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('https://foodclub-2.onrender.com/food', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                setFoodItems(response.data.food || []);
                setFilteredItems(response.data.food || []); // Initialize filtered items
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQMqrku3owmnGlApPA0sLLl_W2I9plWMBKNA&s')`
            }}
        >
            <div className="min-h-screen bg-black/60 pt-5">
                {/* Admin Navigation Button */}
                {(userRole && (userRole.toUpperCase() === 'ADMIN' || userRole.toUpperCase() === 'SUPERADMIN')) && (
                    <div className="max-w-7xl mx-auto px-6 mb-4">
                        <button
                            onClick={() => navigate('/admin')}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                        >
                            Admin Dashboard
                        </button>
                    </div>
                )}

                {/* Filter Section */}
                <div className="max-w-7xl mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search Input */}
                        <div>
                            <input
                                type="text"
                                placeholder="Search foods..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">All Categories</option>
                                <option value="appetizer">Appetizer</option>
                                <option value="main">Main Course</option>
                                <option value="dessert">Dessert</option>
                                <option value="beverage">Beverage</option>
                            </select>
                        </div>

                        {/* Price Range */}
                        <div className="flex items-center space-x-2">
                            <span className="text-black">Max Price: ₨{maxPrice}</span>
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Veg Only Toggle */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="vegOnly"
                                checked={isVegOnly}
                                onChange={(e) => setIsVegOnly(e.target.checked)}
                                className="h-4 w-4 text-orange-500"
                            />
                            <label htmlFor="vegOnly" className="text-black">Vegetarian Only</label>
                        </div>
                    </div>

                    {/* Reset Filters Button */}
                    <button
                        onClick={resetFilters}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Food Items Grid */}
                <div className="max-w-7xl mx-auto p-6">
                    {filteredItems.length === 0 ? (
                        <div className="text-center text-white mt-10 bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-2">No Food Items Found</h2>
                            <p>Try adjusting your filters or search criteria</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
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
                                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                                                    ★ {item.rating.toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-900 font-bold">
                                                    ₨{item.price.toFixed(2)}
                                                    {item.discount > 0 && (
                                                        <span className="text-orange-600 text-sm ml-2">
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
                                        {!isAdminUser && (
                                            <button
                                                className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition duration-200 disabled:bg-gray-400 transform hover:scale-105"
                                                onClick={() => handleAddToCart(item)}
                                                disabled={item.availableQuantity === 0}
                                            >
                                                {item.availableQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FoodList;