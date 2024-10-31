import { useState } from "react";
import Home from "./pages/Home.jsx";
import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Item from "./pages/Item.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/item/:productId" element={<Item />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
