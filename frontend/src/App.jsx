import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import CheckEmail from "./pages/CheckEmail";
import ResetPassword from "./pages/ResetPassword";
import ResetSuccess from "./pages/ResetSuccess";
import CategoryPage from "./pages/CategoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/reset-password/:token?" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetSuccess />} />
        <Route path="/category" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;