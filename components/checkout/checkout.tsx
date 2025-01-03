"use client";
import classes from "@/app/checkout/checkout.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/header/header";
import Footer from "../footer/footer";
import { userDetails } from "@/utils/authUtils";
const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("Name");
  const qty = searchParams.get("Qty");
  const price = searchParams.get("Price");
  const fromCart = searchParams.get("fromCart");
  const priceNum = price ? parseFloat(price) : 0;
  const qtyNum = qty ? parseInt(qty) : 0;
  const total = priceNum * qtyNum;
  const token = Cookies.get("JWT");
  const clearUserCart = async () => {
    const userInfo = await userDetails(token)
    try {
      await axios.delete(`${BACKEND_API}/clearCart/${userInfo.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error clearing user cart: ", err);
    }
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromCart) {
      clearUserCart();
    }
    toast.success("Purchase Successful", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      style: {
        backgroundColor: "#4caf50",
        color: "#fff",
      },
    });
    setTimeout(() => {
      window.location.href = "/home";
    }, 2500);
  };

  return (
    <div>
      <Header heading="Checkout" />
      <form onSubmit={handleFormSubmit}>
        <div className={classes.container}>
          <div>
            <h1>Billing Details</h1>
            <div className={classes.input}>
              <label htmlFor="fname">First Name</label>
              <input required className={classes.inputBox} type="text" />
            </div>
            <div className={classes.input}>
              <label htmlFor="lname">Last Name</label>
              <input required className={classes.inputBox} type="text" />
            </div>
            <div className={classes.input}>
              <label htmlFor="company">Company Name (Optional)</label>
              <input className={classes.inputBox} type="text" />
            </div>
            <div className={classes.input}>
              <label htmlFor="lname">Country/Region</label>
              <select className={classes.inputBox} defaultValue="Sri Lanka">
                <option>Sri Lanka</option>
                <option>USA</option>
                <option>Pakistan</option>
                <option>Australia</option>
              </select>
            </div>
            <div className={classes.input}>
              <label htmlFor="street">Street Address</label>
              <input required className={classes.inputBox} type="text" />
            </div>
            <div className={classes.input}>
              <label htmlFor="town">Town/City</label>
              <input required className={classes.inputBox} type="text" />
            </div>
            <div className={classes.input}>
              <label htmlFor="zip">Zip Code</label>
              <input required className={classes.inputBox} type="number" />
            </div>
            <div className={classes.input}>
              <label htmlFor="phone">Phone</label>
              <input required className={classes.inputBox} type="number" />
            </div>
            <div className={classes.input}>
              <label htmlFor="email">Email address</label>
              <input required className={classes.inputBox} type="email" />
            </div>
            <div className={classes.input}>
              <label />
              <input
                className={classes.inputBox}
                type="text"
                placeholder="Additional information"
              />
            </div>
          </div>
          <div className={classes.productDetails}>
            <div className={classes.productInfo}>
              <div className={classes.product}>
                <h1>Product</h1>
                {fromCart === "true" ? (
                  <>
                    {searchParams.getAll("Name").map((name, index) => (
                      <p key={index}>
                        {name} x {searchParams.getAll("Qty")[index]} - Rs{" "}
                        {searchParams.getAll("Price")[index]}
                      </p>
                    ))}
                  </>
                ) : (
                  <>
                    <p>
                      {name} x {qty}
                    </p>
                    <p>Subtotal</p>
                    <p>Total</p>
                  </>
                )}
              </div>
              {!fromCart && (
                <div className={classes.price}>
                  <h1>Subtotal</h1>
                  <p>{total}</p>
                  <p>{total}</p>
                  <p className={classes.finalTotal}>{total}</p>
                </div>
              )}{" "}
            </div>
            <button type="submit" className={classes.btn}>
              Place Order
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />

      <Footer />
    </div>
  );
}
