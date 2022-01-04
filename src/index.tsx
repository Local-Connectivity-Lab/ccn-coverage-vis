import React from 'react';
import {
  HashRouter as Router,
  Route,
  BrowserRouter,
  Routes,
} from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './Login';
import AdminPortal from './AdminPortal';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin' element={<AdminPortal />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
