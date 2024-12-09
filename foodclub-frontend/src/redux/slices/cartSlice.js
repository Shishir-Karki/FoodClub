import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : {
        items: [],
        totalAmount: 0,
        totalCount: 0,
      };
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return {
        items: [],
        totalAmount: 0,
        totalCount: 0,
      };
    }
  };
  
  const cartSlice = createSlice({
    name: 'cart',
    initialState: loadCartFromStorage(),
    reducers: {
      addToCart: (state, action) => {
        const newItem = action.payload;
        const existingItem = state.items.find(item => item._id === newItem._id);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...newItem, quantity: 1 });
        }
        
        state.totalAmount += Number(newItem.price);
        state.totalCount += 1;
        localStorage.setItem('cart', JSON.stringify(state));
      },
      removeFromCart: (state, action) => {
        const id = action.payload;
        const existingItem = state.items.find(item => item._id === id);
        
        if (existingItem) {
          state.totalAmount -= Number(existingItem.price) * existingItem.quantity;
          state.totalCount -= existingItem.quantity;
          state.items = state.items.filter(item => item._id !== id);
        }
        localStorage.setItem('cart', JSON.stringify(state));
      },
      updateQuantity: (state, action) => {
        const { id, quantity } = action.payload;
        const item = state.items.find(item => item._id === id);
        
        if (item) {
          const difference = quantity - item.quantity;
          item.quantity = quantity;
          state.totalCount += difference;
          state.totalAmount += difference * Number(item.price);
        }
        localStorage.setItem('cart', JSON.stringify(state));
      },
      clearCart: (state) => {
        state.items = [];
        state.totalAmount = 0;
        state.totalCount = 0;
        localStorage.setItem('cart', JSON.stringify(state));
      }
    }
  });

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;