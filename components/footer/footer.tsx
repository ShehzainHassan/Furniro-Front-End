"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import classes from "./footer.module.css";
const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export default function Footer() {
  const [userRole, setUserRole] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const _token = localStorage.getItem("JWT");
      setToken(_token);
    }
  }, []);
  const getUserRole = async () => {
    if (!token) return;
    try {
      const response = await axios.get(
        `${BACKEND_API}/auth/userInfo?token=${token}`
      );
      setUserRole(response.data.role);
    } catch (err) {
      console.error("Error setting user role", err);
    }
  };
  useEffect(() => {
    getUserRole();
  }, []);
  return (
    <>
      <div className={classes.container}>
        <div className={classes.space}>
          <h1>Funiro</h1>
          <div className={classes.addressDetails}>
            <p>400 University Drive Suite 200 Coral Gables</p>
            <p>FL 33134 USA</p>
          </div>
        </div>
        <div className={classes.footerLinks}>
          <p>Links</p>
          <p>
            {userRole?.includes("USER") ? (
              <Link href="/home">Home</Link>
            ) : (
              <Link href="/adminHome">Home</Link>
            )}
          </p>
          <p>
            <Link href="/shop">Shop</Link>
          </p>
          <p>
            <Link href="/about">About</Link>
          </p>
          <p>
            <Link href="/contact">Contact</Link>
          </p>
        </div>
        <div className={classes.footerLinks}>
          <p>Help</p>
          <p>Payment Options</p>
          <p>Returns</p>
          <p>Privacy Policies</p>
        </div>
        <div className={classes.space}>
          <p>Newsletter</p>
          <div className={classes.newsLetter}>
            <input
              className={classes.input}
              type="email"
              placeholder="Enter Your Email Address"></input>
            <button className={`${classes.input} ${classes.btn}`}>
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>
      <div className={classes.divider}>
        <div className={classes.subDivider}>
          <p>2023 furino. All rights reserved</p>
        </div>
      </div>
    </>
  );
}
