import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import History from "./pages/History";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/userSlice";
import { setAuthToken, getUserData } from "./api/apiService";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const authToken = localStorage.getItem("auth_token");

    if (userId && authToken) {
      setAuthToken(authToken); // Set the token in Axios for subsequent requests
      getUserData(userId)
        .then((user) => {
          dispatch(setUser(user));
        })
        .catch((err) => {
          console.error("Failed to fetch user data with token:", err);
          localStorage.removeItem("user_id");
          localStorage.removeItem("auth_token");
        });
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        }
      />
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
