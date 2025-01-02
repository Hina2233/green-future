import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../utils/axiosInstance";
import { toast, Toaster } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      region: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
      region: Yup.string().required("Region is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await axiosInstance.post("/api/register", values);
        toast.success("Registration successful");
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } catch (error) {
        setErrors({
          general:
            error.response?.data?.message || "An error occurred during registration",
        });
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
            Register
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {formik.errors.general && (
              <div className="text-red-600 text-start text-sm">
                {formik.errors.general}
              </div>
            )}
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-start font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="text-sm text-start text-red-600">
                  {formik.errors.name}
                </p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="region"
                className="block text-sm text-start font-medium text-gray-700"
              >
                Region
              </label>
              <select
                id="region"
                name="region"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.region}
                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              >
                <option value="">Select your region</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Africa">Africa</option>
                <option value="Australia">Australia</option>
                <option value="South America">South America</option>
              </select>
              {formik.touched.region && formik.errors.region ? (
                <p className="text-sm text-start text-red-600">
                  {formik.errors.region}
                </p>
              ) : null}
            </div>

            <div>
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
                className="block text-sm text-start font-medium text-gray-700"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm text-start font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <p className="text-sm text-start text-red-600">
                  {formik.errors.confirmPassword}
                </p>
              ) : null}
            </div>
            <Link to="/login" className="flex items-center justify-between">
              <span className="text-sm">Already have an account?</span>
              <span className="text-sm hover:text-indigo-600">Login</span>
            </Link>
            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className={`w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {formik.isSubmitting ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
