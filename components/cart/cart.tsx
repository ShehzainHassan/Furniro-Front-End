"use client";
import { Product } from "@/app/shop/products/page";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import classes from "./cart.module.css";
import { useRouter } from "next/navigation";
import CheckoutPage from "../checkout/checkout";
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

  const email = Cookies.get("loggedEmail");
  const token = Cookies.get("JWT");
  const router = useRouter();
  const calculateCurrentPrice = (originalPrice: number, discount: number) => {
    if (discount > 0) {
      return originalPrice - originalPrice * (discount / 100);
    }
    return originalPrice;
  };

  const loadUserCart = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_API}/getCart?email=${email}`,
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
    try {
      await axios.delete(`${BACKEND_API}/removeProduct/${email}/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    try {
      const response = await axios.get(
        `${BACKEND_API}/userDetails?email=${email}`,
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
    try {
      await axios.delete(`${BACKEND_API}/removeFavorite/${email}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  useEffect(() => {
    if (modalType === "cart") {
      loadUserCart();
    } else if (modalType === "favorites") {
      loadUserFavorites();
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
                        <Image
                          src={`/images/${product.image}`}
                          alt="img"
                          width={100}
                          height={100}
                        />
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
                      <Image
                        src={`/images/${favorite.image}`}
                        alt="img"
                        width={100}
                        height={100}
                      />
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
        ) : null}
      </div>
    </div>
  );
}
