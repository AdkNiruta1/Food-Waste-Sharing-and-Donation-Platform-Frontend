import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../pages/landing";
import Login from "../pages/login/Login";
import Register from "../pages/Register/Register";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
