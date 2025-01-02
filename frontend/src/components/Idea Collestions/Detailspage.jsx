import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserCircleIcon, CalendarIcon } from "@heroicons/react/20/solid";
import Navbar from "../Navbar";
import Footer from "../Footer";
import axiosInstance from "../../utils/axiosInstance";
import { toast, Toaster } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { Dialog } from "@headlessui/react";
import { AiFillStar } from "react-icons/ai";

const Detailspage = () => {
  const { id } = useParams(); // Extract the idea ID from the URL
  const [idea, setIdea] = useState(null); // Idea state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [voting, setVoting] = useState(false); // Voting state
  const [collaborating, setCollaborating] = useState(false); // Collaborating state
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [formData, setFormData] = useState(null); // Edit form data state
  const { user } = useAuth(); // Authenticated user

  useEffect(() => {
    const fetchIdea = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/ideas/${id}`);
        console.log(response.data);
        setIdea(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load idea");
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  const handleVote = async () => {
    setVoting(true);
    try {
      await axiosInstance.put(`/api/ideas/${id}/vote`);
      setIdea((prevIdea) => ({
        ...prevIdea,
        votes: prevIdea.votes + 1,
      }));
      toast.success("Vote registered successfully!");
    } catch (err) {
      toast.error(err?.response?.data || "Failed to register vote");
    } finally {
      setVoting(false);
    }
  };

  const handleCollaborate = async () => {
    setCollaborating(true);
    try {
      await axiosInstance.put(`/api/ideas/${id}/collaborate`);
      setIdea((prevIdea) => ({
        ...prevIdea,
        collaborators: [...prevIdea.collaborators, user],
      }));
      toast.success("Collaborated successfully!");
    } catch (err) {
      toast.error(err?.response?.data || "Failed to collaborate");
    } finally {
      setCollaborating(false);
    }
  };

  const handleEditOpen = () => {
    setFormData({
      title: idea.title,
      description: idea.description,
      category: idea.category,
    });
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveEdit = async (updatedIdea) => {
    try {
      const response = await axiosInstance.put(
        `/api/ideas/${idea._id}/edit`,
        updatedIdea
      );
      setIdea(response.data.idea);
      toast.success("Idea updated successfully!");
      setEditMode(false);
    } catch (err) {
      toast.error(err?.response?.data || "Failed to update idea");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors />
      <div className="bg-gray-50">
        <Navbar />

        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Idea Image */}
            <div>
              <img
                src={idea.image || "https://via.placeholder.com/300"}
                alt={idea.title || "Idea image"}
                className="rounded-lg shadow-md w-full object-cover"
              />
            </div>

            {/* Idea Details */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">{idea.title}</h1>
              <p className="text-gray-600">{idea.description}</p>

              <div className="flex flex-col gap-2">
                <p className="text-gray-700">
                  <span className="font-medium text-gray-900">Category: </span>
                  {idea.category}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-gray-900">Status: </span>
                  {idea.status}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-gray-900">Votes: </span>
                  {idea.votes}
                </p>
              </div>

              {idea?.submittedBy?._id !== user?._id && (
                <div className="space-x-4">
                  <button
                    onClick={handleVote}
                    disabled={voting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    {voting ? "Voting..." : "Vote"}
                  </button>
                  {idea.status === "approved" && idea.isCollab && (
                    <button
                      onClick={handleCollaborate}
                      disabled={collaborating}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                    >
                      {collaborating ? "Collaborating..." : "Collaborate"}
                    </button>
                  )}
                </div>
              )}
              {/* Submitted By */}
              <div className="flex items-center gap-4">
                <UserCircleIcon className="h-6 w-6 text-gray-500" />
                <div>
                  <p className="text-gray-800 font-medium">
                    {idea.submittedBy?.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {idea.submittedBy?.email}
                  </p>
                </div>
              </div>

              {/* Edit Button for Collaborators */}
              {idea.collaborators.some((collab) => collab._id === user._id) && (
                <button
                  onClick={handleEditOpen}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit Idea
                </button>
              )}
            </div>
          </div>

          {/* Collaborators */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800">Collaborators</h2>
            {idea?.collaborators?.length > 0 ? (
              <ul className="mt-4">
                {idea?.collaborators?.map((collaborator) => (
                  <li key={collaborator._id} className="text-gray-700">
                    {collaborator.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No collaborators yet.</p>
            )}
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800">Reviews</h2>
            {idea?.reviews?.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {idea?.reviews?.map((review) => (
                  <li
                    key={review?._id}
                    className="border p-4 rounded-md bg-white shadow-sm"
                  >
                    <p className="text-gray-800 font-medium">
                      {review?.review}
                    </p>
                    <div className="flex items-center mt-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <AiFillStar
                          key={index}
                          className={`h-5 w-5 ${
                            index < review?.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {/* <p className="text-gray-600 text-sm mt-1">
                      Reviewed by: {review?.reviewer?.name || "Anonymous"}
                    </p> */}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editMode && (
          <Dialog
            open={editMode}
            onClose={() => setEditMode(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <Dialog.Title className="text-xl font-semibold">
                Edit Idea
              </Dialog.Title>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit(formData);
                }}
                className="mt-4 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full py-2 px-2  border rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1 block w-full py-2 px-2  border rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full py-2 px-2  border rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </Dialog>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Detailspage;
