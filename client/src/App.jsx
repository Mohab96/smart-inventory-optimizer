// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/Login";
import BusinessData from "./pages/Auth/BusinessData";
import Start from "./pages/Auth/Start";
import StaffManagement from "./pages/Auth/StaffManagement";
import StaffManagement2 from "./pages/Auth/StaffManagement2";
import Dashboard from "./pages/dashboard/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/business-data" element={<BusinessData />}></Route>
        <Route path="/staff-management" element={<StaffManagement />}></Route>
        <Route path="/staff-management2" element={<StaffManagement2 />}></Route>
      </Routes>
    </Router>
  );
}
export default App;
