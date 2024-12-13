"use client";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function ProductDetails() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const pathname = usePathname();
  const token = localStorage.getItem("JWT");

  const calculateCurrentPrice = (originalPrice: number, discount: number) => {
    if (discount > 0) {
      return originalPrice - originalPrice * (discount / 100);
    }
    return originalPrice;
  };

  const updateUserCart = async () => {
    const userEmail = Cookies.get("loggedEmail");
    try {
      await axios.patch(
        "http://localhost:8000/updateCart",
        {
          email: userEmail,
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
    const id = pathname.split("/").pop();
    try {
      const response = await axios.get(`http://localhost:8000/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProduct(response.data);
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
    </>
  );
}
