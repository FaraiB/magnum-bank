import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      const dummyUser = {
        id: userId,
        name: "Maria Silva",
        balance: 5000,
        transactions: [], //will fetch later
      };
      dispatch(setUser(dummyUser));
    }
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      /*other routes*/
    </Routes>
  );
}

export default App;
