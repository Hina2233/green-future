import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "admin") {
      toast.error("Admins cannot register through this page.");
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } else if (role === "innovation_manager") {
      toast.error("Manager cannot register through this page.");
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } else {
      navigate("/register");
    }
  };

  return (
    <>
      <Toaster richColors />
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 bg-white rounded shadow">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Select Your Role
          </h2>
          <div className="mt-6 space-y-4">
            <button
              onClick={() => handleRoleSelection("admin")}
              className="w-full px-4 py-2 font-medium text-white bg-red-600 rounded-md shadow hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Admin
            </button>
            <button
              onClick={() => handleRoleSelection("innovation_manager")}
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manager
            </button>
            <button
              onClick={() => handleRoleSelection("employee")}
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Employee
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelection;
