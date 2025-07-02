import React, { useEffect, useState } from "react";
import "./style/index.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { API_URL } from "../../../API";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isopen, setIsopen] = useState(false);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (userId) {
      axios
        .get(`${API_URL}/user?id=${userId}`)
        .then((user) => {
          // console.log(user.data);
          if (user.data[0].role === "user") {
            navigate("/");
          } else {
            navigate("/dashboard/dashboard");
          }
        })
        .catch((err) => {
          console.error("Error fetching user info: ", err);
        });
    }
  }, [navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/login`, {
        email,
        password,
      })
      .then((data) => {
        localStorage.setItem("id", data.data._id);
        navigate(`${data.data.role === "user" ? "/" : "/dashboard/dashboard"}`);
      })
      .catch((err) => {
        console.error("Login failed: ", err);
        message.error("Enter Correct Email or Password");
      });
  };

  return (
    <div className="user-registration-form">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="Email">Email:</label>
        <input
          type="email"
          id="Email"
          name="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <div style={{ position: "relative" }}>
          <input
            type={isopen ? "text" : "password"}
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            style={{
              position: "absolute",
              cursor: "pointer",
              right: 10,
              top: 10,
            }}
            onClick={() => setIsopen(!isopen)}
          >
            {isopen ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </div>
        </div>
        <div
          style={{
            color: "blue",
            cursor: "pointer",
            marginTop: -10,
            marginBottom: 10,
          }}
          onClick={() => navigate("/forgot")}
        >
          Forgot Password
        </div>
        <input type="submit" value="Login" />
      </form>
      <div
        onClick={() => navigate("/signup")}
        style={{
          fontSize: 15,
          fontWeight: 500,
          color: "white",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        If you do not have an account, Sign Up
      </div>
    </div>
  );
};
