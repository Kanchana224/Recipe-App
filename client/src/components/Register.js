import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const Email = email.toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      setShowError(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:2000/auth/register",
        { name, email: Email, password }
      );

      if (response.status === 201) {
        const { newUser, token } = response.data;

        if (newUser.error) {
          toast.warn("User already exists. Try with a different email.");
        } else {
          toast.success("Registration successful.");
          localStorage.setItem("token", token);
          // Redirect to login page
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } else {
        console.error("Failed to register user:", response.status);
      }
    } catch (error) {
      toast.error("An error occurred while registering user:", error.message);
    }
  };

  return (
    <div className="SignupContainer">
      <form onSubmit={(e) => handleSubmit(e)}>
        <h2>SignUp</h2>
        <input
          type="text"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Your Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {showError && (
        <span className="fill-fields-error">Please fill in all fields.</span>
      )}
      <ToastContainer />
    </div>
  );
};

export default Register;
