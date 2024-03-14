import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const Email = email.toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setShowError(true);
      return;
    }

    try {
      const response = await axios.post(
        "https://recipe-app-1-jspe.onrender.com/auth/login",
        { email: Email, password }
      );

      if (!response.data.error) {
        toast.success("Login Successful");
        localStorage.setItem("token", response.data.token);

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
      toast.error("An error occurred while logging in");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://recipe-app-1-jspe.onrender.com/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Handle response
          console.log(response.data);
        })
        .catch((error) => {
          // Handle error
          console.error("Error fetching data:", error);
          toast.error("Unauthorized: Please log in.");
        });
    }
  }, []);

  return (
    <div className="SignupContainer">
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Enter Your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {showError && (
        <span className="fill-fields-error">Please Fill all the fields</span>
      )}
      <ToastContainer />
    </div>
  );
};

export default Login;
