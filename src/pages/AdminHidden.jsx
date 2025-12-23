// src/pages/AdminHidden.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHidden() {
  const navigate = useNavigate();

  useEffect(() => {
    const ok = sessionStorage.getItem("plb_admin_auth");
    if (ok !== "yes") navigate("/adminsecure");
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">You are authenticated.</p>
    </div>
  );
}
