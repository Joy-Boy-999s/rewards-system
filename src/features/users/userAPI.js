import axios from "axios";

export const fetchUsersAPI = async () => {
  const response = await axios.get("http://localhost:5000/users");
  return response.data;
};
