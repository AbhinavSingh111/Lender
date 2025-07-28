import React from "react";
import { Routes, Route } from "react-router-dom";
import BorrowerList from "./components/BorrowerList";
import BorrowerDetail from "./components/BorrowerDetail";
import LendingForm from "./components/LendingForm";
import RepaymentForm from "./components/RepaymentForm";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<BorrowerList />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/borrower/:id" element={<BorrowerDetail />} />
    <Route path="/add-lending" element={<LendingForm />} />
    <Route path="/add-repayment" element={<RepaymentForm />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
);

export default AppRoutes;