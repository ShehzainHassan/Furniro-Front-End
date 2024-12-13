"use client";
import classes from "@/app/signup/page.module.css";
import loginImg from "@/public/images/login.png";
import logo from "@/public/images/logo.png";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import classes2 from "./page.module.css";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const redirectToHome = async () => {
    const userEmail = Cookies.get("loggedEmail");
    try {
      const response = await axios.get(
        `http://localhost:8000/getUserRole?email=${userEmail}`
      );
      if (response.data.includes("ADMIN")) {
        window.location.href = "/adminHome";
      } else {
        window.location.href = "/home";
      }
    } catch (err) {
      console.error("Error redirecting to Home ", err);
    }
  };
  const checkUserInDB = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("JWT", response.data.token);
      Cookies.set("loggedEmail", formData.email);
      Cookies.set("loggedIn", "true");
      Cookies.set("JWT", response.data.token);
      redirectToHome();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const { message } = error.response.data;
        setErrors((prevState) => ({
          ...prevState,
          email: message,
        }));
        console.log("Error loading user from DB: ", error);
      } else {
        setErrors((prevState) => ({
          ...prevState,
          email: "An error occurred. Please try again later.",
        }));
      }
    }
  };

  return (
    <form onSubmit={checkUserInDB}>
      <div className={classes2.container}>
        <div className={classes.login}>
          <div className={classes.logo}>
            <Image src={logo} alt="logo" priority />
            <p>Welcome back!!!</p>
          </div>
          <div className={classes.signIn}>
            <h1>Sign In</h1>
            <div className={classes.email_Pass}>
              <label htmlFor="email">Email</label>
              <input
                className={classes.inputBox}
                type="email"
                name="email"
                required
                id="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className={classes.email_Pass}>
              <label htmlFor="password">Password</label>
              <input
                className={classes.inputBox}
                type="password"
                name="password"
                required
                id="password"
                placeholder="Enter your password..."
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              Don&apos;t have an account?{" "}
              <span className={classes.loginText}>
                <Link href="/signup">Register</Link>
              </span>
            </div>
            {errors.email && <p className={classes.error}>{errors.email}</p>}

            <button
              type="submit"
              className={`${classes.inputBox} ${classes.btn} ${classes2.login}`}>
              Login
            </button>
          </div>
        </div>
        <div className={classes.image}>
          <Image
            className={classes.loginImg}
            src={loginImg}
            alt="login-image"
          />
        </div>
      </div>
    </form>
  );
}
