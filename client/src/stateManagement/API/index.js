// fetch data from api
import axios from "axios";
let baseURL;
if (process.env.NODE_ENV !== "production") {
  baseURL = "http://localhost:5000/API/";
} else {
  baseURL = "http://localhost:5000/API/";
}
const API = axios.create({ baseURL }, { withCredentials: true });
API.interceptors.request.use(
  (req) => {
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZGlsaXAiLCJpYXQiOjE2NzI4NjQ2MDksImV4cCI6MTY3NTQ1NjYwOX0.y_USh6S4F0jPIhGZP9c8estbytoUODeQ0V-47yslLI4`;
    req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => {
    return Promise.reject(error.message);
  }
);
export default API;
