// Signup.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Animation from "./Animation";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(120);

  const navigate = useNavigate();
  const otpInputs = useRef([]);

  // Timer Effect for Resend OTP Button
  useEffect(() => {
    if (resendDisabled) {
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) {
            setResendDisabled(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Decrease every second

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [resendDisabled]);

  const validateUsername = async (username) => {
    if (!username.trim()) {
      setUsernameValid(null); // Reset validation state if username is empty
      return;
    }

    try {
      const response = await fetch(
        `https://bakbak.onrender.com/signup/check-username?q=${username}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsernameValid(!data.exists); // `exists` is true if username already exists
      } else {
        console.error("Failed to validate username");
      }
    } catch (error) {
      console.error("Error validating username:", error);
    }
  };
  // Set to true if username is not taken, false otherwise

  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase();
    setUsername(value);
    if (value.length >= 3) {
      validateUsername(value);
    } else {
      setUsernameValid(null); // Reset validation state for invalid input length
    } // Trigger validation on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://bakbak.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Username: username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token); // Store the token
        console.log("Signup successful:", data);
        navigate("/chat");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred during signup");
    }
  };

  const handleSendOTP = async () => {
    try {
      const response = await fetch("https://bakbak.onrender.com/otp/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setOtpToken(data.token);
        console.log("OTP sent successfully");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("An error occurred while sending OTP");
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch("https://bakbak.onrender.com/otp/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otp.join(""), token: otpToken }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpVerified(true);
        setError(null);
        console.log("OTP verified successfully");
      } else {
        setError(data.error || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("An error occurred while verifying OTP");
    }
  };

  const handleResend = async () => {
    // Reset the timer and disable the button
    setResendTimer(120);
    setResendDisabled(true);
    setError(null);
    setOtp(["", "", "", "", "", ""]);

    // Call the function to resend the OTP
    await handleSendOTP();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: `url("k.jpg")` }}
    >
      {/* Floating elements for GSAP animation */}
      <div className="max-sm:hidden">
        <Animation />
      </div>

      <div className="bg-white relative p-8 rounded-xl shadow-md w-96">
        <img src="bk.png" alt="logo" className="h-10 ml-auto mr-auto mb-3 " />
        <h2 className="text-[14px] font-extrabold mb-5 text-center text-purple-600">
          Sign up for Chat
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your Username"
              value={username}
              onChange={handleUsernameChange}
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                usernameValid === null
                  ? "border-gray-300"
                  : usernameValid
                  ? "border-green-500"
                  : "border-red-500"
              } rounded-md shadow-sm focus:outline-none`}
            />
            {usernameValid === false && (
              <p className="text-red-500 text-sm mt-1">
                ❌ Username isn't available
              </p>
            )}
            {usernameValid === true && (
              <p className="text-green-500 text-sm mt-1">
                ✅Username is available
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="flex mt-1">
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value) }
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={otpSent}
                className={`px-3 py-1 border border-transparent text-sm font-medium rounded-r-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  ${otpSent ? 'bg-green-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {otpSent ? "OTP Sent..." : "Send OTP"}
              </button>
            </div>
          </div>
            {otpVerified === true && (
              <p className="text-green-500 text-sm">
                ✅Email is Verified yahooo..
              </p>
            )}
          {/* OTP Section */}
          {otpSent && !otpVerified && (
            <div>
              <label className="block text-sm font-medium">Enter OTP</label>
              <div className="flex space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    ref={(el) => (otpInputs.current[index] = el)}
                    className="w-10 h-10 text-center border rounded-md"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleVerifyOTP}
                className="bg-green-500 text-white mt-2 w-full py-1 rounded-md hover:bg-green-600"
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* Resend OTP */}
          {otpSent && !otpVerified && (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendDisabled}
              className={`mt-2 w-full py-1 rounded-md ${
                resendDisabled
                  ? "bg-gray-300 text-gray-600"
                  : "bg-indigo-600 text-white hover:bg-indigo-800"
              }`}
            >
              {resendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
            </button>
          )}
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
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Error message display */}
          {error && (
            <p className="text-red-500 text-sm mt-2 font-bold">
              Warning: {error} 😭
            </p>
          )}

          <button
            type="submit"
            disabled={!otpVerified}
            className={`w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium ${
              otpVerified
                ? "bg-indigo-600 text-white"
                : "bg-purple-300 text-white"
            }`}
          >
            Sign up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </a>
        </p>
       
      </div>
    </div>
  );
}
