export const isOnline = () => {
    return window.navigator.onLine;
  };
  
  export const saveIdeaOffline = (idea) => {
    let offlineIdeas = JSON.parse(localStorage.getItem("offlineIdeas")) || [];
    offlineIdeas.push(idea);
    localStorage.setItem("offlineIdeas", JSON.stringify(offlineIdeas));
  };
  
  export const getOfflineIdeas = () => {
    return JSON.parse(localStorage.getItem("offlineIdeas")) || [];
  };
  
  export const clearOfflineIdeas = () => {
    localStorage.removeItem("offlineIdeas");
  };