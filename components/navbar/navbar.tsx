"use client";
import logo from "@/public/images/logo.png";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { IoPersonOutline } from "react-icons/io5";
import ShoppingCart from "../cart/cart";
import classes from "./navbar.module.css";

type NavbarProps = {
  role?: string[];
};
export default function Navbar({ role }: NavbarProps) {
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const email = Cookies.get("loggedEmail");

  useEffect(() => {
    getCartItemCount();
  }, []);

  if (typeof window == "undefined") return null;

  const token = localStorage.getItem("JWT");

  const Logout = () => {
    localStorage.clear();
    Cookies.remove("loggedEmail");
    Cookies.remove("loggedIn");
    Cookies.remove("JWT");
    window.location.href = "/";
  };

  const toggleCart = () => {
    setIsCartVisible(!isCartVisible);
  };
  const close = () => {
    setIsCartVisible(false);
  };

  const getCartItemCount = async () => {
    try {
      const response = await axios.get(
        `https://furniro.up.railway.app/getCart?email=${email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartItems(response.data.cart.length);
    } catch (err) {
      console.error("Error loading cart items", err);
    }
  };
  if (!email) {
    return null;
  }
  return (
    <>
      <div
        className={`${classes.container} ${
          role?.includes("ADMIN") ? classes.admin : ""
        }`}>
        <div className={classes.logo}>
          <Image src={logo} alt="logo.png"></Image>
          <button onClick={Logout}>Logout</button>
        </div>
        <div className={classes.navElements}>
          <p>
            {role?.includes("USER") ? (
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
        <div className={classes.navIcons}>
          <p>
            <IoPersonOutline />
          </p>
          <p>
            <CiHeart />
          </p>
          <p className={classes.cartIcon} onClick={toggleCart}>
            <AiOutlineShoppingCart />
            {cartItems > 0 && (
              <span className={classes.itemCount}>{cartItems}</span>
            )}
          </p>
        </div>
      </div>

      <ShoppingCart isVisible={isCartVisible} closeCart={close} />
    </>
  );
}
