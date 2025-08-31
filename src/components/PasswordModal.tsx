import React, { useState, memo } from "react";
import "../pages/Transactions.css";

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
        setError("Invalid transaction password.");
        setPassword("");
      }
    };

    if (!isOpen) {
      return null;
    }

    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Enter Transaction Password</h3>
          <form onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="action-btn">
              Confirm
            </button>
            <button type="button" className="action-btn" onClick={onClose}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }
);

export default PasswordModal;
