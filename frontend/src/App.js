import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from "react-router-dom";

import Header from './components/Header/Header';
import CustomRoutes from './config/CustomRoutes';
import Footer from './components/Footer/Footer';
import BackToTop from './components/BackToTop/BackToTop'
import AuthModal from './components/Auth/AuthModal';
import userApi from './api/modules/usersApi';
import { setUser } from './redux/features/userSlice';

import './App.css'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const authUser = async () => {
      const { response, err } = await userApi.getInfo();

      if (response) dispatch(setUser(response));
      if (err) dispatch(setUser(null));
    };

    authUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <CustomRoutes />
      <BackToTop />
      <AuthModal />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
