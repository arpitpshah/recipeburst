import React from 'react';
import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import HomeScreen from '../../pages/HomeScreen';
import RegisterScreen from '../../pages/RegisterScreen';
import LoginScreen from '../../pages/LoginScreen';
import ProfilePage from '../../pages/ProfileScreen';
import RecipeForm from '../../pages/RecipeForm';
import MyRecipes from '../../pages/MyRecipes';
import RecipeDetails from '../../pages/RecipeDetails';
import { ProtectedRoute } from '../PortectedRoute';
import { NotFoundScreen } from '../NotFound';
import { Container } from '@mui/material';

const Routes: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <Container style={{maxWidth:'100%'}} className='p-0'>
      <ReactRoutes>
      <Route path='/' element={<HomeScreen />} />
      <Route path='/SignUp' element={isLoggedIn ? <Navigate to="/" /> : <RegisterScreen />} />
      <Route path='/login' element={isLoggedIn ? <Navigate to="/" /> : <LoginScreen />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
      <Route path="/addRecipe" element={<ProtectedRoute><RecipeForm/></ProtectedRoute>} />
      <Route path="/myrecipes" element={<ProtectedRoute><MyRecipes/></ProtectedRoute>} />
      <Route path="/recipes/:recipeId" element={<RecipeDetails/>} />
      {/* 404 Not Found Route */}
      <Route path='*' element={<NotFoundScreen />} />
    </ReactRoutes>
    </Container>
    
  );
};

export default Routes;
