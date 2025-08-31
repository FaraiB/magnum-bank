import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setAuthToken } from "../api/apiService";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import "./Login.css";

const Login = () => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    cpf: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous API errors

    // Clear previous validation errors
    setValidationErrors({ cpf: "", password: "" });

    let hasError = false;

    // Basic CPF validation: checks for 11 digits
    if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        cpf: "CPF must be 11 digits.",
      }));
      hasError = true;
    }

    // Basic password validation: checks for a minimum length
    if (password.length < 6) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 6 characters.",
      }));
      hasError = true;
    }

    if (hasError) {
      return; // Stop the function if there are validation errors
    }

    try {
      const { user, token } = await login(cpf, password);
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("auth_token", token);
      setAuthToken(token);
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
          {validationErrors.cpf && (
            <p className="validation-error">{validationErrors.cpf}</p>
          )}
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
          {validationErrors.password && (
            <p className="validation-error">{validationErrors.password}</p>
          )}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
