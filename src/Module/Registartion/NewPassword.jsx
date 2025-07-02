import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../API";

const NewPassword = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const id = localStorage.getItem("id");
    if (!id) {
      navigate("/forgot");
    }
  }, []);

  const [Password, setPassword] = useState("");
  const _id = localStorage.getItem("id");

  const onSumbit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await axios.put(`${API_URL}/forgot`, {
        id: _id,
        password: Password,
      });
      // console.log("New password forgot response : ", response);
      localStorage.removeItem("id");
      localStorage.removeItem("forgot");
      navigate(`/`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="user-registration-form">
      <h1>Forgot Password</h1>
      <form onSubmit={onSumbit}>
        <label htmlFor="NewPassword">New Password:</label>
        <input
          type="password"
          id="NewPassword"
          name="NewPassword"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="forgot-pwd-btn" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default NewPassword;
