import { t } from "i18next";
import React, { useState, memo } from "react";

type PasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
};

const PasswordModal: React.FC<PasswordModalProps> = memo(
  ({ isOpen, onClose, onSubmit }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (password === "1234") {
        onSubmit(password);
        setPassword("");
        setError("");
      } else {
        setError(t("modals.password.error"));
        setPassword("");
      }
    };

    if (!isOpen) {
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {t("modals.password.title")}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t("modals.password.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-1">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-center text-lg tracking-widest"
                placeholder="••••"
                autoFocus
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {t("modals.password.cancel")}
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {t("modals.password.confirm")}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export default PasswordModal;
