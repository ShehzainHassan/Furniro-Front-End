"use client";
import loginImg from "@/public/images/login.png";
import logo from "@/public/images/logo.png";
import { redirectToHome } from "@/utils/authUtils";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./page.module.css";

interface ApiError {
  status: string;
  message: string;
}

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

interface SignupProps {
  isAdmin?: boolean;
}

export default function Signup({ isAdmin }: SignupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    let formValid = true;
    const errors = { name: "", email: "", password: "", confirmPassword: "" };

    const regex = /\d/;
    if (regex.test(formData.name)) {
      errors.name = "Name cannot contains numbers";
      formValid = false;
    }
    if (formData.password.length < 8) {
      errors.password = "Password must contains at least 8 characters";
      formValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      formValid = false;
    }
    setErrors(errors);
    return formValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      saveUserToDB();
    }
  };

  const saveUserToDB = async () => {
    try {
      const response = await axios.post(`${BACKEND_API}/auth/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (!isAdmin) {
        Cookies.set("JWT", response.data.token);
        redirectToHome(response.data.token);
      } else {
        toast.success("User Created Successfully", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          style: {
            backgroundColor: "green",
            color: "#fff",
          },
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        if (axiosError.response && axiosError.response.data) {
          const { status, message } = axiosError.response.data;
          if (status === "fail") {
            setErrors((prevState) => ({
              ...prevState,
              email: message,
            }));
          }
          console.log("Error saving user to DB: ", axiosError);
        }
      } else {
        console.error("Unexpected error: ", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.container}>
        <div className={classes.login}>
          {!isAdmin && (
            <div className={classes.logo}>
              <Image src={logo} alt="logo" />
              <p>Welcome</p>
            </div>
          )}
          <div className={classes.signIn}>
            <h1>Sign Up</h1>
            <div className={classes.email_Pass}>
              <label htmlFor="name">Name</label>
              <input
                className={classes.inputBox}
                type="text"
                name="name"
                required
                id="name"
                placeholder="John"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className={classes.error}>{errors.name}</p>}
            </div>
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
              {errors.email && <p className={classes.error}>{errors.email}</p>}
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
              {errors.password && (
                <p className={classes.error}>{errors.password}</p>
              )}
            </div>
            <div className={classes.email_Pass}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                className={classes.inputBox}
                type="password"
                name="confirmPassword"
                required
                id="confirmPassword"
                placeholder="Confirm your password..."
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className={classes.error}>{errors.confirmPassword}</p>
              )}
            </div>
            {!isAdmin && (
              <div>
                Already have an account?{" "}
                <span className={classes.loginText}>
                  <Link href="/login">Login</Link>
                </span>
              </div>
            )}
            <button
              type="submit"
              className={`${classes.inputBox} ${classes.btn}`}>
              {isAdmin ? "Add User" : "Register"}
            </button>
          </div>
        </div>
        {!isAdmin && (
          <div className={classes.image}>
            <Image
              className={classes.loginImg}
              src={loginImg}
              alt="login-image"
            />
          </div>
        )}
      </div>
      <ToastContainer />
    </form>
  );
}
