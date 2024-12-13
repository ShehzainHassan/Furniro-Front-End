"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Products from "../shop/products/page";

export default function DeleteProduct() {
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadProducts();
  }, []);

  if (typeof window == "undefined") return null;

  const token = localStorage.getItem("JWT");

  const loadProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getProducts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalProducts(response.data.length);
    } catch (err) {
      console.error("Error loading Products", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", padding: "10px" }}>Delete Product</h1>
      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <Products itemsToLoad={totalProducts} isDeleting={true} heading="" />
      )}
    </div>
  );
}
