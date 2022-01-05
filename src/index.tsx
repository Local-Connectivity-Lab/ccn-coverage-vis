// import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './Login';
import AdminPortal from './AdminPortal';
import './index.css';

ReactDOM.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login' element={<Login />} />
      <Route path='/admin' element={<AdminPortal />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root'),
);
