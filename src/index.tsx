import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Vis from './vis/Vis';
import Login from './admin/Login';
import AdminPortal from './admin/AdminPortal';
import ListSites from './admin/ListSites';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');

// Make sure the element exists
if (!rootElement) throw new Error('Failed to find the root element');

// Create a root
const root = createRoot(rootElement);

// Render your app
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Vis />} />
      <Route path='/ccn-coverage-vis' element={<Vis />} />
      <Route path='/login' element={<Login />} />
      <Route path='/admin' element={<AdminPortal />} />
      <Route path='/admin/users' element={<AdminPortal page={'users'} />} />
      <Route path='/admin/list-sites' element={<ListSites />} />
      <Route
        path='/admin/edit-site'
        element={<AdminPortal page='edit-site' />}
      />
      <Route
        path='/admin/edit-data'
        element={<AdminPortal page='edit-data' />}
      />
    </Routes>
  </BrowserRouter>,
);
