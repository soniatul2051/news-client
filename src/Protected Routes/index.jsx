import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Module/Admin/LayOut";
import { API_URL } from "../../API";

const ProtectedRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      // If no user ID is found, redirect to the login page
      navigate("/login");
      return;
    }

    axios
      .get(`${API_URL}/user?id=${userId}`)
      .then((response) => {
        const user = response.data[0];
        if (user?.role !== "user") {
          setIsAdmin(true);
        } else {
          navigate("/login"); // Redirect if not an admin
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/login"); // Redirect on error
      });
  }, [navigate]);

  return isAdmin ? (
    <AdminLayout />
  ) : (
    <div style={{ fontSize: "30px", textAlign: "center", margin: "20px 0" }}>
      Not Found
    </div>
  );
};

export default ProtectedRoute;
