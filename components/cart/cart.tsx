"use client";
import { Product } from "@/app/shop/products/page";
import { userDetails } from "@/utils/authUtils";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./cart.module.css";

interface Cart {
  id: string;
  qty: number;
}

interface CartProps {
  isVisible: boolean;
  modalType: string;
  closeCart: () => void;
}

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export default function ShoppingCart({
  isVisible,
  modalType,
  closeCart,
}: CartProps) {
  const [products, setProducts] = useState<(Product & { quantity: number })[]>(
    []
  );
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
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

  const token = Cookies.get("JWT");
  const router = useRouter();

  const calculateCurrentPrice = (originalPrice: number, discount: number) => {
    if (discount > 0) {
      return originalPrice - originalPrice * (discount / 100);
    }
    return originalPrice;
  };

  const loadUserCart = async () => {
    const userInfo = await userDetails(token);
    try {
      const response = await axios.get(
        `${BACKEND_API}/getCart?email=${userInfo.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadProducts(response.data.cart);
    } catch (err) {
      console.error("Error loading user cart: ", err);
    }
  };

  const loadProducts = async (cartItems: Cart[]) => {
    try {
      const productRequests = cartItems.map(async (item) => {
        const productResponse = await axios.get(
          `${BACKEND_API}/product/${item.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return {
          ...productResponse.data,
          quantity: item.qty,
        };
      });
      const productsData = await Promise.all(productRequests);
      setProducts(productsData);
      calculateCartTotal(productsData);
    } catch (err) {
      console.error("Error loading product details: ", err);
    }
  };

  const deleteFromCart = async (_id: string) => {
    const userInfo = await userDetails(token);
    try {
      await axios.delete(
        `${BACKEND_API}/removeProduct/${userInfo.email}/${_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadUserCart();
      window.location.reload();
    } catch (err) {
      console.error("Error deleting product from cart ", err);
    }
  };

  const calculateCartTotal = (products: (Product & { quantity: number })[]) => {
    const total = products.reduce(
      (sum, product) =>
        sum +
        product.quantity *
          calculateCurrentPrice(product.originalPrice, product.discount),
      0
    );
    setCartTotal(total);
  };

  const loadUserFavorites = async () => {
    const userInfo = await userDetails(token);
    try {
      const response = await axios.get(
        `${BACKEND_API}/userDetails?email=${userInfo.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const favoriteProductIds = response.data?.favorites;
      if (favoriteProductIds && favoriteProductIds.length > 0) {
        const productRequests = favoriteProductIds.map(async (favorite) => {
          try {
            const productResponse = await axios.get(
              `${BACKEND_API}/product/${favorite._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return productResponse.data;
          } catch (err) {
            console.error(
              `Error fetching product details for ID: ${favorite._id}`,
              err
            );
          }
        });

        const productDetails = await Promise.all(productRequests);
        setFavorites(productDetails);
      } else {
        console.log("No favorite products found.");
      }
    } catch (err) {
      console.error("Error loading user favorites", err);
    }
  };

  const removeFavorite = async (id: string) => {
    const userInfo = await userDetails(token);
    try {
      await axios.delete(
        `${BACKEND_API}/removeFavorite/${userInfo.email}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadUserFavorites();
      window.location.reload();
    } catch (err) {
      console.error("Error removing favorite", err);
    }
  };

  const proceedToCheckout = () => {
    const productsData = products.map((product) => ({
      Name: product.productName,
      Qty: product.quantity,
      Price: product.originalPrice,
    }));

    const queryParams = productsData
      .map((p) => `Name=${p.Name}&Qty=${p.Qty}&Price=${p.Price}`)
      .join("&");
    console.log(queryParams);
    router.push(`/checkout?fromCart=true&${queryParams}`);
  };

  const loadUserDetails = async () => {
    try {
      const response = await userDetails(token);
      setFormData({
        name: response.name,
        email: response.email,
        password: response.password,
        confirmPassword: response.password,
      });
    } catch (err) {
      console.error("Error loading user details ", err);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
  const updateProfile = async () => {
    const userInfo = await userDetails(token);
    try {
      const response = await axios.put(
        `${BACKEND_API}/updateUser/${userInfo.email}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response) {
        toast.success("Profile Updated Successfully", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          style: {
            backgroundColor: "#4caf50",
            color: "#fff",
          },
        });
      }
    } catch (err) {
      console.error("Error updating user ", err);
      toast.error("Error updating profile ", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });
    }
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateProfile();
    }
  };
  useEffect(() => {
    if (modalType === "cart") {
      loadUserCart();
    } else if (modalType === "favorites") {
      loadUserFavorites();
    } else {
      loadUserDetails();
    }
  }, [isVisible, modalType]);

  return (
    <div className={`${classes.container} ${isVisible ? classes.show : ""}`}>
      <div className={classes.subContainer}>
        {modalType === "cart" ? (
          <>
            <div className={classes.cart}>
              <h1>Shopping Cart</h1>
              <button onClick={closeCart} className={classes.close}>
                X
              </button>
            </div>
            {products.length > 0 ? (
              products.map((product, index) => {
                const currentPrice = calculateCurrentPrice(
                  product.originalPrice,
                  product.discount
                );
                return (
                  <div className={classes.product} key={index}>
                    <div className={classes.cartItems}>
                      <div className={classes.productInfo}>
                        <Link href={`/shop/products/${product._id}`}>
                          <Image
                            src={`/images/${product.image}`}
                            alt="img"
                            width={100}
                            height={100}
                            className={classes.productImage}
                          />
                        </Link>

                        <div className={classes.productDetails}>
                          <p>{product.productName}</p>
                          <div className={classes.productQtyPrice}>
                            <p>{product.quantity}</p>
                            <p>x</p>
                            <p>Rs {currentPrice.toFixed(0)}</p>
                          </div>
                        </div>
                        <div className={classes.deleteButton}>
                          <button onClick={() => deleteFromCart(product._id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <p>Your cart is empty</p>
              </div>
            )}
            <div className={classes.cartTotal}>
              <p>
                Total:{" "}
                <span className={classes.finalTotal}>
                  Rs {cartTotal.toFixed(0)}
                </span>
              </p>
              {products.length > 0 && (
                <div>
                  <button
                    onClick={proceedToCheckout}
                    className={classes.checkoutBtn}>
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : modalType === "favorites" ? (
          <>
            <div className={classes.cart}>
              <h1>Favorites</h1>
              <button onClick={closeCart} className={classes.close}>
                X
              </button>
            </div>
            {favorites.length > 0 ? (
              favorites.map((favorite, index) => (
                <div className={classes.product} key={index}>
                  <div className={classes.cartItems}>
                    <div className={classes.favoriteProducts}>
                      <Link href={`/shop/products/${favorite._id}`}>
                        <Image
                          src={`/images/${favorite.image}`}
                          alt="img"
                          width={100}
                          height={100}
                          className={classes.productImage}
                        />
                      </Link>
                      <div className={classes.productDetails}>
                        <p>{favorite.productName}</p>
                        <p>
                          Category:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {favorite.category}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeFavorite(favorite._id)}
                        className={classes.remove}>
                        X
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <p>No favorite products found</p>
              </div>
            )}
          </>
        ) : modalType === "profile" ? (
          <>
            <div className={classes.cart}>
              <h1>Profile</h1>
              <button onClick={closeCart} className={classes.close}>
                X
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className={classes.userInfo}>
                <div>
                  <div className={classes.inputBox}>
                    <label htmlFor="name">Name</label>
                    <input
                      className={classes.input}
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      type="text"
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className={classes.errorText}>{errors.name}</p>
                  )}
                  <div className={classes.inputBox}>
                    <label htmlFor="email">Email</label>
                    <input
                      className={classes.input}
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      type="email"
                      required
                    />
                  </div>
                  <div className={classes.inputBox}>
                    <label htmlFor="password">Password</label>
                    <input
                      className={classes.input}
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      type="password"
                      required
                    />
                  </div>
                  {errors.password && (
                    <p className={classes.errorText}>{errors.password}</p>
                  )}
                  <div className={classes.inputBox}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      className={classes.input}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleFormChange}
                      type="password"
                      required
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className={classes.errorText}>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <button
                  className={classes.btn}
                  disabled={
                    !formData.name ||
                    !formData.email ||
                    !formData.password ||
                    !formData.confirmPassword
                  }
                  type="submit">
                  Update Profile
                </button>
              </div>
            </form>
          </>
        ) : null}
      </div>
      <ToastContainer />
    </div>
  );
}
