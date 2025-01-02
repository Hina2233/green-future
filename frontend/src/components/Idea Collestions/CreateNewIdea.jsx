import { useFormik } from "formik";
import Navbar from "./../Navbar";
import axiosInstance from "../../utils/axiosInstance";
import Footer from "../Footer";
import { toast, Toaster } from "sonner";
import { useRef, useState } from "react";
import * as Yup from "yup";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isOnline, saveIdeaOffline } from "../../utils/offlineUtils";

const CreateNewIdea = () => {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
      image: null,
      isCollab: false,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title is required")
        .max(100, "Title must not exceed 100 characters"), // Added max length validation
      description: Yup.string()
        .required("Description is required")
        .max(500, "Description must not exceed 500 characters"), // Added max length validation
      category: Yup.string().required("Category is required"),
      image: Yup.mixed()
        .nullable()
        .test(
          "fileType",
          "Only image files are allowed",
          (value) =>
            !value || (value && ["image/jpeg", "image/png", "image/gif"].includes(value.type))
        )
        .test(
          "fileSize",
          "File size must be less than 2MB",
          (value) => !value || (value && value.size <= 2 * 1024 * 1024)
        ), // Added file type and size validation
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      const idea = {
        title: values.title,
        description: values.description,
        category: values.category,
        isCollab: values.isCollab,
      };

      if (isOnline()) {
        try {
          const formData = new FormData();
          formData.append("title", values.title);
          formData.append("description", values.description);
          formData.append("category", values.category);
          formData.append("isCollab", values.isCollab);
          if (values.image) {
            formData.append("image", values.image);
          }

          const response = await axiosInstance.post("/api/ideas/add", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log("Form submitted successfully:", response.data);
          toast.success("Idea submitted successfully!");
          resetForm(); // Reset form using Formik's resetForm function
          if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input manually
          navigate("/home-page");
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("Failed to submit the idea. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      } else {
        saveIdeaOffline(idea);
        alert("You are offline. Your idea has been saved and will be submitted when you are back online.");
        setIsSubmitting(false);
      }
    },
  });

  return (
    <>
      <Toaster richColors />
      <Navbar />
      <form
        onSubmit={formik.handleSubmit}
        className="mx-auto rounded-md my-8 bg-white shadow-sm ring-1 ring-gray-900/5 max-w-3xl px-14 py-10 sm:px-6 sm:py-6 lg:max-w-3xl lg:px-10"
      >
        <div className="space-y-10">
          <div className="border-gray-900/10 pb-12">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create New Idea
            </h2>
            <div className="mt-1 grid grid-cols-1 gap-x-6 border-t pt-4 border-gray-900/10 gap-y-4 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-900"
                >
                  Title
                </label>
                <div className="mt-2">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    {...formik.getFieldProps("title")}
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div className="text-red-600 text-sm">
                      {formik.errors.title}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    rows={10}
                    id="description"
                    name="description"
                    {...formik.getFieldProps("description")}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div className="text-red-600 text-sm">
                      {formik.errors.description}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-900"
                >
                  Category
                </label>
                <div className="mt-2">
                  <select
                    id="category"
                    name="category"
                    {...formik.getFieldProps("category")}
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    <option value="Technology">Technology</option>
                    <option value="Science">Science</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                  </select>
                  {formik.touched.category && formik.errors.category ? (
                    <div className="text-red-600 text-sm">
                      {formik.errors.category}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-900"
                >
                  Image
                </label>
                <div className="mt-2">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    ref={fileInputRef}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        formik.setFieldValue("image", file);
                      }
                    }}
                    className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="isCollab"
                  className="block text-sm font-medium text-gray-900"
                >
                  Collaboration
                </label>
                <div className="mt-2 flex items-center">
                  <input
                    id="isCollab"
                    name="isCollab"
                    type="checkbox"
                    {...formik.getFieldProps("isCollab")}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="isCollab" className="ml-2 block text-sm text-gray-900">
                    Is this a collaborative idea?
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold text-gray-900 hover:bg-gray-100 px-10 py-3"
            onClick={() => {
              formik.resetForm();
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-10 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Save"}
          </button>
        </div>
      </form>
      <Footer />
    </>
  );
};

export default CreateNewIdea;
