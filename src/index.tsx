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
      <Route path='/' element={<App />} />
      <Route path='/ccn-coverage-vis' element={<App />} />
      <Route path='/login' element={<Login />} />
      <Route path='/admin' element={<AdminPortal />} />
      <Route path='/admin/users' element={<AdminPortal page={'users'} />} />
      <Route
        path='/admin/edit-site'
        element={<AdminPortal page='edit-site' />}
      />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root'),
);
