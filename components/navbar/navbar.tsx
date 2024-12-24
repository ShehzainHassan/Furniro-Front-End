"use client";
import logo from "@/public/images/logo.png";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { IoPersonOutline } from "react-icons/io5";
import ShoppingCart from "../cart/cart";
import classes from "./navbar.module.css";
import { userDetails } from "@/utils/authUtils";

type NavbarProps = {
  role?: string[];
};
const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export default function Navbar({ role }: NavbarProps) {
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isFavoriteVisible, setIsFavoriteVisible] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [favoriteItems, setFavoriteItems] = useState(0);

  useEffect(() => {
    getCartItemCount();
    getFavoritesItemCount();
  }, []);

  if (typeof window == "undefined") return null;

  const token = Cookies.get("JWT");

  const Logout = () => {
    Cookies.remove("JWT");
    window.location.href = "/";
  };

  const toggleFavorites = () => {
    setIsFavoriteVisible(!isFavoriteVisible);
  };
  const toggleCart = () => {
    setIsCartVisible(!isCartVisible);
  };
  const closeCart = () => {
    setIsCartVisible(false);
    setIsFavoriteVisible(false);
  };
  const getCartItemCount = async () => {
    const userInfo = await userDetails(token);
    try {
      const response = await axios.get(
        `${BACKEND_API}/getCart?email=${userInfo.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartItems(response.data.cart.length);
    } catch (err) {
      console.error("Error loading cart items", err);
    }
  };
  const getFavoritesItemCount = async () => {
    const userInfo = await userDetails(token);
    try {
      const response = await axios.get(
        `${BACKEND_API}/userDetails?email=${userInfo.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFavoriteItems(response.data.favorites.length);
    } catch (err) {
      console.error("Error loading user details ", err);
    }
  };
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
          <p className={classes.cartIcon} onClick={toggleFavorites}>
            <CiHeart />
            {favoriteItems > 0 && (
              <span className={classes.itemCount}>{favoriteItems}</span>
            )}
          </p>
          <p className={classes.cartIcon} onClick={toggleCart}>
            <AiOutlineShoppingCart />
            {cartItems > 0 && (
              <span className={classes.itemCount}>{cartItems}</span>
            )}
          </p>
        </div>
      </div>

      {isCartVisible && (
        <Suspense fallback={<div>Loading...</div>}>
          <ShoppingCart
            isVisible={isCartVisible}
            modalType="cart"
            closeCart={closeCart}
          />
        </Suspense>
      )}

      {isFavoriteVisible && (
        <Suspense fallback={<div>Loading...</div>}>
          <ShoppingCart
            isVisible={isFavoriteVisible}
            modalType="favorites"
            closeCart={closeCart}
          />
        </Suspense>
      )}
    </>
  );
}
