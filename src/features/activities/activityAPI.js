const BASE_URL = "http://localhost:5000/activities"; // Use json-server for mock API

const activityAPI = {
  getActivities: async () => {
    return fetch(BASE_URL).then((res) => res.json());
  },
  addActivity: async (activity) => {
    return fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    }).then((res) => res.json());
  },
};

export default activityAPI;
