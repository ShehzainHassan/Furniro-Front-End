"use client";
import Footer from "@/components/footer/footer";
import { userDetails } from "@/utils/authUtils";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Products from "../page";
import classes from "./page.module.css";

interface Product {
  _id: string;
  productName: string;
  description: string;
  image: string;
  category: string;
  originalPrice: number;
  discount: number;
  isNew: boolean;
}
const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetails() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const pathname = usePathname();
  const token = Cookies.get("JWT");
  const id = pathname.split("/").pop();

  const calculateCurrentPrice = (originalPrice: number, discount: number) => {
    if (discount > 0) {
      return originalPrice - originalPrice * (discount / 100);
    }
    return originalPrice;
  };

  const updateUserCart = async () => {
    const userInfo = await userDetails(token);
    try {
      await axios.patch(
        `${BACKEND_API}/updateCart`,
        {
          email: userInfo.email,
          productId: selectedProduct?._id,
          qty: quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const loadSelectedProduct = async () => {
    try {
      const response = await axios.get(`${BACKEND_API}/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProduct(response.data);
      const _response = await userDetails(token);
      if (_response?.favorites.some((p) => p._id === id)) {
        setIsDisabled(true);
      }
    } catch (err) {
      console.error("Error loading product details ", err);
    }
  };

  const proceedToCheckout = () => {
    if (selectedProduct) {
      const productName = selectedProduct.productName;
      const qty = quantity;
      const price = calculateCurrentPrice(
        selectedProduct.originalPrice,
        selectedProduct.discount
      );

      router.push(`/checkout?Name=${productName}&Qty=${qty}&Price=${price}`);
    }
  };
  const addProductToFavorites = async () => {
    const userInfo = await userDetails(token);
    try {
      const response = await axios.post(
        `${BACKEND_API}/addFavorite/${userInfo.email}/${selectedProduct._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response) {
        toast.success("Product added to favorites", {
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
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error("Error adding product to favorites", err);
      toast.error("Failed to add product to favorites", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        style: {
          backgroundColor: "red",
          color: "#fff",
        },
      });
    }
  };
  useEffect(() => {
    loadSelectedProduct();
  }, [pathname]);

  if (!selectedProduct) {
    return <div>Loading Product Details...</div>;
  }

  const currentPrice = calculateCurrentPrice(
    selectedProduct.originalPrice,
    selectedProduct.discount
  );

  return (
    <>
      <div className={classes.container}>
        <div className={classes.imgContainer}>
          <div className={classes.imageColumn}>
            <Image
              className={classes.img}
              src={`/images/${selectedProduct?.image}`}
              alt={`${selectedProduct?.productName}`}
              width={100}
              height={100}
            />
            <Image
              className={classes.img}
              src={`/images/${selectedProduct?.image}`}
              alt={`${selectedProduct?.productName}`}
              width={100}
              height={100}
            />
            <Image
              className={classes.img}
              src={`/images/${selectedProduct?.image}`}
              alt={`${selectedProduct?.productName}`}
              width={100}
              height={100}
            />
            <Image
              className={classes.img}
              src={`/images/${selectedProduct?.image}`}
              alt={`${selectedProduct?.productName}`}
              width={100}
              height={100}
            />
          </div>
          <div className={classes.largeImageColumn}>
            <Image
              className={classes.mainImg}
              src={`/images/${selectedProduct?.image}`}
              alt={`${selectedProduct?.productName}`}
              width={100}
              height={400}
            />
          </div>
        </div>
        <div className={classes.productInfo}>
          <h1>{selectedProduct?.productName}</h1>
          <p>Price: Rs {currentPrice.toFixed(0)}</p>

          <p>{selectedProduct?.description}</p>
          <div className={classes.productSize}>
            <p>Size</p>
            <div className={classes.sizes}>
              <button className={classes.btn}>L</button>
              <button className={classes.btn}>XL</button>
              <button className={classes.btn}>XS</button>
            </div>
          </div>
          <div>
            <p>Color</p>
            <div>
              <button
                className={`${classes.btn} ${classes.color} ${classes.color1}`}
              />
              <button
                className={`${classes.btn} ${classes.color} ${classes.color2}`}
              />
              <button
                className={`${classes.btn} ${classes.color} ${classes.color3}`}
              />
            </div>
          </div>
          <div>
            <div className={classes.qty}>
              <div className={classes.amount}>
                <button
                  onClick={() => setQuantity((prev) => prev - 1)}
                  className={classes.change}
                  disabled={quantity === 0}>
                  -
                </button>
                <p className={classes.quantity}>{`${quantity}`}</p>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className={classes.change}>
                  +
                </button>
              </div>
              <div className={classes.buttons}>
                <button
                  onClick={updateUserCart}
                  className={classes.btn2}
                  disabled={quantity === 0}>
                  Add To Cart
                </button>

                <button
                  onClick={() => {
                    proceedToCheckout();
                  }}
                  className={classes.btn2}
                  disabled={quantity === 0}>
                  Checkout
                </button>

                <button
                  onClick={addProductToFavorites}
                  disabled={isDisabled}
                  className={classes.btn2}>
                  Add To Favorites
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Products
        heading="Related Products"
        category={selectedProduct?.category}
        itemsToLoad={4}
      />
      <Footer />
    </>
  );
}
