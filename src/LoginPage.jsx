import React, { useState } from "react";
import axios from "axios";

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post('https://taxiwheel-backend.onrender.com/login', {
                email,
                password
            });

            if (response.status === 200) {
                // Login successful
                onLogin(response.data.admin);
            }
        } catch (err) {
            // Handle login error
            setError("Invalid email or password");
            console.error('Login error:', err);
        }
    };
   
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  export default LoginPage;
