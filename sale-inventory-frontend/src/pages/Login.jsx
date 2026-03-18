import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // SAVE AUTH DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      //  GO TO DASHBOARD
      navigate("/dashboard");

    } catch (err) {
      alert("Invalid login");
    }
  };


  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      {error && (
        <p className="text-red-500 text-sm text-center mb-3">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        < button className="w-full bg-blue-600 text-white py-2 rounded-lg">
          Login
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        New user?{" "}
        <Link to="/register" className="text-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
