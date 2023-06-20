// import React from 'react';
import { Route, BrowserRouter, Routes } from "react-router-dom";
import ReactDOM from "react-dom";
import Vis from "./vis/Vis";
import Login from "./admin/Login";
import AdminPortal from "./admin/AdminPortal";
import "./index.css";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Vis />} />
      <Route path="/ccn-coverage-vis" element={<Vis />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminPortal />} />
      <Route path="/admin/users" element={<AdminPortal page={"users"} />} />
      <Route
        path="/admin/edit-site"
        element={<AdminPortal page="edit-site" />}
      />
      <Route
        path="/admin/edit-data"
        element={<AdminPortal page="edit-data" />}
      />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
