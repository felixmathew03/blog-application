import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";
import Dashboard from "./pages/Dashboard";
import EditBlog from "./pages/EditBlog";
import Toast from "./components/Toast";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toast />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-blog/:id" element={<EditBlog />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;