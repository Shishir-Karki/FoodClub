import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Signup from './components/Signup';
import FoodList from './components/FoodList';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './components/AdminDashboard';
import Cart from './components/Cart';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/food"
            element={
              <PrivateRoute>
                <FoodList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;