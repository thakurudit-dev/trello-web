import React, { useState } from "react";
import apiHelper from "../helpers/api-helper";
import DEVELOPMENT_CONFIG from "../helpers/config";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const success = (msg) => {
    toast.success(msg, {
      autoClose: 5000,
    });
  };

  // LOGIN USER
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }
    setError("");
    let data = JSON.stringify({
      email,
      password,
    });
    let result = await apiHelper.postRequest("log-in", data);
    if (result?.code === DEVELOPMENT_CONFIG.statusCode) {
      localStorage.setItem("token", result?.body?.token);
      localStorage.setItem("loggedInUser", result?.body?.user?.id);
      navigate("/dashbord");
      success(result?.message);
    } else {
      setError(result?.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-between min-h-80 m-16">
      <div className="flex justify-between">
        <p className="text-2xl font-bold text-gray-600 text-center">Log In</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          Login
        </button>
        <p className="text-center text-sm text-gray-600">
            Do not have an account? <Link to="/sign-up" className="text-blue-600 font-semibold">Sign Up</Link>
        </p>
      </form>
      <ToastContainer rtl />
    </div>
  );
}
