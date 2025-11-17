import React, { useContext } from "react";
import './App.css';
import './styles/theme.css';
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recipes from "./pages/Recipes";
import ProtectedRoute from "./components/ProtectedRoute";
import Categories from "./pages/Categories";
import FormAddRecipe from "./components/FormAdding/FormAddRecipe";
import FormAddCategory from "./components/FormAdding/FormAddCategory";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import OpenRecipe from "./pages/OpenRecipe";

function App() {
  return (
    <div className="main">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={ <Login /> } />
            <Route path="/register" element={ <Register /> } />

            <Route path="/" element={
              <ProtectedRoute>
                <Recipes />
              </ProtectedRoute>
            } />
            <Route path="/categories" element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            } />
            <Route path="/add_recipe" element={
              <ProtectedRoute>
                <FormAddRecipe />
              </ProtectedRoute>
            } />
            <Route path="/add_category" element={
              <ProtectedRoute>
                <FormAddCategory />
              </ProtectedRoute>
            } />
            <Route path="/open_recipe/:id" element={
              <ProtectedRoute>
                <OpenRecipe />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

          </Routes>
        </Router>
      </AuthProvider>
    </div>
  )
};

export default App;
