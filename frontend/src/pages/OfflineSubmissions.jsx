import React from "react";
import { getOfflineIdeas, clearOfflineIdeas } from "../utils/offlineUtils";

const OfflineSubmissions = () => {
  const offlineIdeas = getOfflineIdeas();

  const handleClearOfflineIdeas = () => {
    clearOfflineIdeas();
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Offline Submissions</h1>
      {offlineIdeas.length === 0 ? (
        <p>No offline submissions available.</p>
      ) : (
        <div>
          {offlineIdeas.map((idea, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <h2 className="text-xl font-bold">{idea.title}</h2>
              <p>{idea.description}</p>
              <p><strong>Category:</strong> {idea.category}</p>
              <p><strong>Collaboration:</strong> {idea.collaboration ? "Yes" : "No"}</p>
            </div>
          ))}
          <button
            onClick={handleClearOfflineIdeas}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            Clear Offline Submissions
          </button>
        </div>
      )}
    </div>
  );
};

export default OfflineSubmissions;