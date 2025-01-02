import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email Required"),
      password: Yup.string()
        .min(5, "Password must be at least 5 characters")
        .required("Password Required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const { user } = await login(values.email, values.password); // Get the user from the response
        toast.success("Login successful!");
        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/admin/dashboard");
          } else if (user.role === "innovation_manager") {
            navigate("/manager/dashboard");
          } else {
            navigate("/home-page");
          }
        }, 500);
      } catch (error) {
        setErrors({ general: error });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Toaster richColors />
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 bg-white rounded shadow">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Log in
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {formik.errors.general && (
              <div className="text-red-600 text-start text-sm">
                {formik.errors.general}
              </div>
            )}
            <div className="py-4">
              <label
                htmlFor="email"
                className="block text-sm text-start font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-sm text-start text-red-600">
                  {formik.errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-start  font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-sm text-start text-red-600">
                  {formik.errors.password}
                </p>
              ) : null}
            </div>

            <Link
              to="/role-selection"
              className="flex items-center justify-end"
            >
              <span className="text-sm hover:text-indigo-600">
                Don't have an account?
              </span>
            </Link>

            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className={`w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {formik.isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
