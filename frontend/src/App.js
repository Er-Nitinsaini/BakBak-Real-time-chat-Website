import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashbord from "./components/Dashbord";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ResetPassword from "./components/ResetPassword";

const App = () => {
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!localStorage.getItem("token"); // Check if the user is logged in based on token

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1700);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200 overflow-hidden">
        <div className="flex justify-center items-center flex-col">
          <div>
            <img src="/bk.png" alt="logo"/>
          </div>
          <img
            src="/ppp.png"
            alt="Loading..."
            className="loading-image h-12 w-12 animate-pulse"
          />
          <div className="mt-20 font-extrabold text-2xl">
            <h1>Loading.........</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/chat" /> : <Login />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/re-set/password" element={<ResetPassword />} />
        <Route path="/chat" element={<Dashbord />} />
      </Routes>
    </Router>
  );
};

export default App;
