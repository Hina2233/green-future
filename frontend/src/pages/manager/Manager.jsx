"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast, Toaster } from "sonner";
import { FaStar } from "react-icons/fa";
import { HomeIcon } from "@heroicons/react/20/solid";

const navigation = [
  {
    name: "Manage Ideas",
    href: "/manager/dashboard",
    icon: HomeIcon,
    current: true,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Manager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/api/manager/ideas");
        console.log("data", response.data);
        setIdeas(response.data);
      } catch (err) {
        console.error("Error fetching ideas:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  //   const handleRatingChange = (value) => {
  //     setRating(value);
  //   };

  const handleShortlist = async (id) => {
    try {
      await axiosInstance.put(`/api/manager/ideas/${id}/shortlist`);
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) =>
          idea._id === id ? { ...idea, shortlisted: true } : idea
        )
      );
      toast.success("Idea shortlisted successfully!");
    } catch (err) {
      console.error("Error shortlisting idea:", err.message);
      toast.error("Failed to shortlist idea.");
    }
  };

  const handleReviewChange = (id, value) => {
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) =>
        idea._id === id ? { ...idea, review: value } : idea
      )
    );
  };

  const handleRatingChange = (id, value) => {
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) =>
        idea._id === id ? { ...idea, rating: value } : idea
      )
    );
  };

  const handleReward = async (id) => {
    try {
      const idea = ideas.find((idea) => idea._id === id);
      if (!idea?.shortlisted) {
        toast.error("You can only reward shortlisted ideas.");
        return;
      }

      await axiosInstance.post(`/api/manager/ideas/${id}/reward`, {
        review: idea.review || "",
        rating: idea.rating || 0,
      });
      toast.success("Reward successfully sent!");
    } catch (err) {
      console.error("Error rewarding idea:", err.message);
      toast.error("Failed to reward idea.");
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length <= maxLength
      ? text
      : `${text.substring(0, maxLength)}...`;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Toaster richColors />
      <div className="">
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <h2 className="text-white text-xl font-semibold">
                    Manager Dashboard
                  </h2>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation?.map((item, index) => (
                            <li key={index}>
                              <a
                                href={item?.href}
                                className={classNames(
                                  item?.current
                                    ? "bg-indigo-700 text-white"
                                    : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                )}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className={classNames(
                                    item?.current
                                      ? "text-white"
                                      : "text-indigo-200 group-hover:text-white",
                                    "size-6 shrink-0"
                                  )}
                                />
                                {item?.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <h2 className="text-white text-xl font-semibold">
                Manager Dashboard
              </h2>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation?.map((item, index) => (
                      <li key={index}>
                        <a
                          href={item?.href}
                          className={classNames(
                            item?.current
                              ? "bg-indigo-700 text-white"
                              : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              item?.current
                                ? "text-white"
                                : "text-indigo-200 group-hover:text-white",
                              "size-6 shrink-0"
                            )}
                          />
                          {item?.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            <div className="flex w-full justify-end">
              <button
                onClick={handleLogout}
                className="hover:text-gray-200 px-4 py-2 rounded-md bg-indigo-600 text-white focus:outline-none"
              >
                Logout
              </button>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Ideas</h1>
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="mt-8 flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                              >
                                Title
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Description
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Status
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {ideas?.map((idea) => (
                              <tr key={idea._id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  <div className="flex items-center gap-x-1.5">
                                    <img
                                      src={idea?.image}
                                      alt={idea.title}
                                      className="rounded-full w-10 h-10 object-cover object-center"
                                    />
                                    <span className="text-sm font-medium text-gray-900">
                                      {idea.title}
                                    </span>
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {truncateText(idea.description, 50)}
                                </td>
                                <td className="whitespace-nowrap capitalize px-3 py-4 text-sm text-gray-500">
                                  {idea.status}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {!idea.shortlisted && (
                                    <button
                                      onClick={() => handleShortlist(idea._id)}
                                      className="text-green-600 hover:underline"
                                    >
                                      Shortlist
                                    </button>
                                  )}
                                  {idea?.shortlisted && (
                                    <div className="flex flex-col">
                                      <textarea
                                        value={idea.review || ""}
                                        onChange={(e) =>
                                          handleReviewChange(
                                            idea._id,
                                            e.target.value
                                          )
                                        }
                                        className="mt-2 p-2 w-full border rounded-md"
                                        placeholder="Add a review"
                                      />
                                      <div className="flex gap-x-1 mt-2">
                                        {[1, 2, 3, 4, 5].map((value, index) => (
                                          <FaStar
                                            key={index}
                                            size={20}
                                            className={`cursor-pointer ${
                                              value <= (idea.rating || 0)
                                                ? "text-yellow-400"
                                                : "text-gray-400"
                                            }`}
                                            onClick={() =>
                                              handleRatingChange(
                                                idea._id,
                                                value
                                              )
                                            }
                                          />
                                        ))}
                                      </div>
                                      <button
                                        onClick={() => handleReward(idea._id)}
                                        className="text-white bg-indigo-500 rounded-md p-2 hover:bg-indigo-400 mt-2 block"
                                      >
                                        Reward
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Manager;
