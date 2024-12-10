import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const navigate = useNavigate();
  
  
  const [newFoodItem, setNewFoodItem] = useState({
    name: '',
    price: '',
    category: '',
    isVeg: false,
    description: '',
    details: '',
    deliveryTime: '',
    availableQuantity: '',
    discount: '',
    imgUrl: ''
  });

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await axios.get('https://foodclub-2.onrender.com/food', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.food) {
        setFoodItems(response.data.food);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  const validateFoodItem = (item) => {
    if (!item.name || item.name.trim() === '') 
      throw new Error('Name is required');
    if (!item.price || item.price <= 0) 
      throw new Error('Price must be greater than 0');
    if (!item.category) 
      throw new Error('Category is required');
    if (!item.deliveryTime || item.deliveryTime <= 0) 
      throw new Error('Delivery time must be greater than 0');
    if (!item.availableQuantity || item.availableQuantity < 0) 
      throw new Error('Available quantity cannot be negative');
    if (item.discount < 0 || item.discount > 100) 
      throw new Error('Discount must be between 0 and 100');
  };



  
    const handleEdit = async (id) => {
      try {
        const itemToEdit = foodItems.find(item => item._id === id);
        if (!itemToEdit) {
          toast.error('Food item not found');
          return;
        }
  
        // Set the form data with the item to edit
        setNewFoodItem({
          name: itemToEdit.name,
          price: itemToEdit.price,
          category: itemToEdit.category,
          isVeg: itemToEdit.isVeg,
          description: itemToEdit.description || '',
          details: itemToEdit.details || '',
          deliveryTime: itemToEdit.deliveryTime,
          availableQuantity: itemToEdit.availableQuantity,
          discount: itemToEdit.discount,
          imgUrl: itemToEdit.imgUrl
        });
        setEditingItem(itemToEdit);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Edit error:', error);
        toast.error('Failed to edit food item');
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        validateFoodItem(newFoodItem);
  
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login again');
          navigate('/');
          return;
        }
  
        setLoading(true);
  
        const endpoint = editingItem 
          ? `https://foodclub-2.onrender.com/food/${editingItem._id}`
          : 'https://foodclub-2.onrender.com/food';
        
        const method = editingItem ? 'put' : 'post';
  
        const response = await axios({
          method,
          url: endpoint,
          data: newFoodItem,
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (response.data.status === 'success') {
          toast.success(editingItem ? 'Food item updated successfully' : 'Food item added successfully');
          fetchFoodItems();
          resetForm();
        }
      } catch (error) {
        console.error('Submit error:', error);
        toast.error(error.response?.data?.message || 'Failed to save food item');
      } finally {
        setLoading(false);
      }
    };
  
    // Add reset form function
    const resetForm = () => {
      setNewFoodItem({
        name: '',
        price: '',
        category: '',
        isVeg: false,
        description: '',
        details: '',
        deliveryTime: '',
        availableQuantity: '',
        discount: '',
        imgUrl: ''
      });
      setEditingItem(null);
    };
  
   
    
  

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await axios.delete(
        `https://foodclub-2.onrender.com/food/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.status === 'success') {
        toast.success('Food item deleted successfully');
        fetchFoodItems();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete food item');
    }
  };

  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={() => navigate('/food')}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200"
          >
            Menu
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Add Food Item Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Food Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Food Name"
                value={newFoodItem.name}
                onChange={(e) => setNewFoodItem({...newFoodItem, name: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newFoodItem.price}
                onChange={(e) => setNewFoodItem({...newFoodItem, price: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
              <select
                value={newFoodItem.category}
                onChange={(e) => setNewFoodItem({...newFoodItem, category: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="appetizer">Appetizer</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
              <input
                type="number"
                placeholder="Delivery Time (minutes)"
                value={newFoodItem.deliveryTime}
                onChange={(e) => setNewFoodItem({...newFoodItem, deliveryTime: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
              <input
                type="number"
                placeholder="Available Quantity"
                value={newFoodItem.availableQuantity}
                onChange={(e) => setNewFoodItem({...newFoodItem, availableQuantity: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
              <input
                type="number"
                placeholder="Discount (%)"
                value={newFoodItem.discount}
                onChange={(e) => setNewFoodItem({...newFoodItem, discount: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
            
            <textarea
              placeholder="Description"
              value={newFoodItem.description}
              onChange={(e) => setNewFoodItem({...newFoodItem, description: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            
            <textarea
              placeholder="Details"
              value={newFoodItem.details}
              onChange={(e) => setNewFoodItem({...newFoodItem, details: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            
            <input
              type="text"
              placeholder="Image URL"
              value={newFoodItem.imgUrl}
              onChange={(e) => setNewFoodItem({...newFoodItem, imgUrl: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newFoodItem.isVeg}
                onChange={(e) => setNewFoodItem({...newFoodItem, isVeg: e.target.checked})}
                className="mr-2 h-4 w-4 text-blue-600"
              />
              <label>Vegetarian</label>
            </div>
            
            <button 
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors disabled:bg-orange-300"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Food Item'}
            </button>
          </form>
        </div>

        {/* Food Items List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Current Food Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodItems.map((item) => (
              <div key={item._id} className="border p-4 rounded hover:shadow-lg transition-shadow">
                <img 
                  src={item.imgUrl || '/default-food-image.jpg'} 
                  alt={item.name} 
                  className="w-full h-48 object-cover rounded mb-2"
                  onError={(e) => {
                    e.target.src = '/default-food-image.jpg';
                  }}
                />
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="font-bold mt-2">Price: Rs{item.price}</p>
                <p>Category: {item.category}</p>
                <p>Available: {item.availableQuantity}</p>
                <p>Delivery Time: {item.deliveryTime} mins</p>
                {item.discount > 0 && (
                  <p className="text-green-600">Discount: {item.discount}%</p>
                )}
                <p className={item.isVeg ? "text-green-600" : "text-red-600"}>
                  {item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                </p>
                <div className="mt-2 space-x-2">
                  <button 
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                    onClick={() => handleEdit(item._id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;