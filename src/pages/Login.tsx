import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setAuthToken } from "../api/apiService";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../i18n/components/LanguageProvider";

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
  const { t } = useTranslation();

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
        cpf: t("auth.cpfError"),
      }));
      hasError = true;
    }

    // Basic password validation: checks for a minimum length
    if (password.length < 6) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        password: t("auth.passwordError"),
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
      setError(t("auth.loginError"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-lg px-8 py-10">
          <div className="flex flex-col items-center justify-center mb-8">
            <img src="logo-magnum.png" alt="Magnum Bank" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Magnum Bank
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-1">
              <label
                htmlFor="cpf"
                className="block text-sm font-medium text-gray-700"
              >
                {t("auth.cpf")}
              </label>
              <input
                type="text"
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
                className={`w-full px-3 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                  validationErrors.cpf
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                placeholder={t("auth.cpfPlaceholder")}
              />
              {validationErrors.cpf && (
                <p className="text-red-600 text-xs mt-1 font-medium">
                  {validationErrors.cpf}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {t("auth.password")}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-3 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                  validationErrors.password
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
                placeholder={t("auth.passwordPlaceholder")}
              />
              {validationErrors.password && (
                <p className="text-red-600 text-xs mt-1 font-medium">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
            >
              {t("auth.loginButton")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
