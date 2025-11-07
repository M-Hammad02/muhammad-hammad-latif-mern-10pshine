import axios from "axios";
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token){
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
}

// Optional: response interceptor to handle 401 globally
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // you can handle global errors here
    return Promise.reject(err);
  }
);
