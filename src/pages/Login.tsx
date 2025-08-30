import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setAuthToken } from "../api/apiService";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const Login = () => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // clear previous errors

    try {
      const { user, token } = await login(cpf, password);
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("auth_token", token); // Store the token
      setAuthToken(token); // Set the auth header for all subsequent requests
      dispatch(setUser(user));
      navigate("/");
    } catch (err) {
      setError("Invalid CPF or Password.");
    }
  };
  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="cpf">CPF:</label>
          <input
            type="text"
            id="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
