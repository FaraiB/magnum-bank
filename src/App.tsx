import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

const Home = () => <h1>Welcome to the Homepage</h1>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
