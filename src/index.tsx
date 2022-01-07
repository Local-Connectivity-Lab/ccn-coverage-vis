// import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './Login';
import AdminPortal from './AdminPortal';
import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/ccn-coverage-vis/' element={<App />} />
      <Route path='/ccn-coverage-vis/login' element={<Login />} />
      <Route path='/ccn-coverage-vis/admin' element={<AdminPortal />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root'),
);
