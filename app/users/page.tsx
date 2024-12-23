"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./page.module.css";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

interface UserListProps {
  isDeleting?: boolean;
  isEditing?: boolean;
}
export default function UsersList({ isDeleting, isEditing }: UserListProps) {
  const [users, setUsers] = useState([]);
  const token = Cookies.get("JWT");

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_API}/deleteUser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User Deleted Successfully", {
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
      getUsers();
    } catch (err) {
      console.error("Error deleting user ", err);
      toast.error("Failed to delete user", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        style: {
          background: "red",
          color: "#FFF",
        },
      });
    }
  };
  const getUsers = async () => {
    try {
      const response = await axios.get(`${BACKEND_API}/getAllUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response = ", response.data);
      setUsers(response.data);
    } catch (err) {
      console.error("Error loading users", err);
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Users</h1>
      <div className={classes.table}>
        <div className={classes.tableHeading}>
          <p>Name</p>
          <p>Email</p>
          <p>Role</p>
          <p>Action</p>
        </div>
        {users.map((user, index) => (
          <div className={classes.userDetail} key={index}>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p
              className={
                user.role.includes("USER") ? classes.user : classes.admin
              }>
              {user.role}
            </p>
            {isDeleting && (
              <button
                disabled={user.role.includes("ADMIN")}
                onClick={() => deleteUser(user._id)}
                className={`${classes.action} ${classes.delete}`}>
                Delete
              </button>
            )}
            {isEditing && (
              <button className={`${classes.action} ${classes.edit}`}>
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}
