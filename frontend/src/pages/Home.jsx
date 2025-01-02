import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  HandThumbUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import axiosInstance from "../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // For filtered results
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchIdeas = async () => {
    try {
      const res = await axiosInstance.get("/api/ideas");
      setProducts(res?.data);
      setFilteredProducts(res?.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update filtered products whenever the search term changes
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 w-full min-h-screen">
        <div className="mx-auto py-10 sm:py-10 max-w-7xl">
          <div className="flex justify-between items-center gap-4 ">
            <h2 className="text-2xl font-bold text-gray-800">
              Idea Collections
            </h2>
            <div className="flex flex-1 items-center justify-end gap-x-3">
              <div className="relative w-full max-w-sm">
                <input
                  name="search"
                  type="search"
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-full bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none transition"
                />
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                />
              </div>
              <Link
                to="/create-new-idea"
                className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 -ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">No ideas found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 pt-14">
              {filteredProducts.map((product) => (
                <div
                  key={product?._id}
                  onClick={() => navigate(`/detail-page/${product?._id}`)}
                  className="group cursor-pointer relative flex flex-col overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    alt={product?.imageAlt || "Idea image"}
                    src={product?.image || "https://via.placeholder.com/300"}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-md font-semibold text-gray-800 truncate capitalize">
                      {product?.title || "Untitled Idea"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3 ">
                      {product?.description || "No description available."}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-medium ">
                        {"Votes: " + product?.votes || 0}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product?.category || "General"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
