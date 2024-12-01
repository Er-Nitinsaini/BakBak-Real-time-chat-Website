// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Animation from "./Animation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://bakbak.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token); // Store the token

        navigate("/chat");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred during login");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 overflow-y-hidden bg-cover bg-center "
      style={{ backgroundImage: `url("k.jpg")` }}
    >
      {/* Floating elements for GSAP animation */}
      <div className="max-sm:hidden">

      <Animation />
      </div>

      <div className="relative bg-white p-8 rounded-lg shadow-md w-96 ">
        <img src="bk.png" alt="" className=" h-10 ml-auto mr-auto mb-5" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Error message display */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log in
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </a>
        </p>
        <p className="mt-0 text-center text-[12px] text-gray-600">
          Re-Set Password?{" "}
          <a
            href="/re-set/password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forget password?
          </a>
        </p>
       
      </div>
    </div>
  );
}
