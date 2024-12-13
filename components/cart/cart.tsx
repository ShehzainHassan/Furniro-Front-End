"use client";
import { Product } from "@/app/shop/products/page";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import classes from "./cart.module.css";

interface Cart {
  id: string;
  qty: number;
}

interface CartProps {
  isVisible: boolean;
  closeCart: () => void;
}

export default function ShoppingCart({ isVisible, closeCart }: CartProps) {
  const [products, setProducts] = useState<(Product & { quantity: number })[]>(
    []
  );
  const [cartTotal, setCartTotal] = useState<number>(0);
  const email = Cookies.get("loggedEmail");
  const token = Cookies.get("JWT");
  console.log("token = ", token);

  const calculateCurrentPrice = (originalPrice: number, discount: number) => {
    if (discount > 0) {
      return originalPrice - originalPrice * (discount / 100);
    }
    return originalPrice;
  };

  const loadUserCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/getCart?email=${email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadProducts(response.data.cart);
    } catch (err) {
      console.error("Error loading user cart: ", err);
    }
  };

  const deleteFromCart = (_id: string) => {
    try {
      axios.delete(`http://localhost:8000/removeProduct/${email}/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadUserCart();
      window.location.reload();
    } catch (err) {
      console.error("Error deleting product from cart ", err);
    }
  };

  const loadProducts = async (cartItems: Cart[]) => {
    try {
      const productRequests = cartItems.map(async (item) => {
        const productResponse = await axios.get(
          `http://localhost:8000/product/${item.id}`,
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

  useEffect(() => {
    loadUserCart();
  }, [isVisible]);

  return (
    <div className={`${classes.container} ${isVisible ? classes.show : ""}`}>
      <div className={classes.subContainer}>
        <div className={classes.cart}>
          <h1>Shopping Cart</h1>
          <button onClick={closeCart} className={classes.close}>
            X
          </button>
        </div>
        {products?.length > 0 ? (
          products?.map((product, index) => {
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
        </div>
      </div>
    </div>
  );
}
