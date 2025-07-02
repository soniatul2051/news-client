import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../API";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const onSumbit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/forgot`, { email })
      .then((data) => {
        // console.log("forget password response : ", data);
        localStorage.setItem("id", data.data._id);
        localStorage.setItem("forgot", "true");
        navigate(
          `${`/verfication/${data.data._id}?forgot=true?token=${data.data?.token}`}`
        );
      })
      .catch((err) => {
        console.log("error in forget password : ", err);
      });
  };
  return (
    <div className="user-registration-form">
      <h1>Forgot Password</h1>
      <form onSubmit={onSumbit}>
        <label htmlFor="Email">Email:</label>
        <input
          type="email"
          id="Email"
          name="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input type="submit" value="Forgot Password" />
      </form>
    </div>
  );
};

export default ForgotPassword;
