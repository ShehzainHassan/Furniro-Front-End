"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Products from "../shop/products/page";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export default function EditProduct() {
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadProducts();
  }, []);

  if (typeof window == "undefined") return null;
  const token = localStorage.getItem("JWT");

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${BACKEND_API}/getProducts`, {
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
      <h1 style={{ textAlign: "center", padding: "10px" }}>
        Select a product to edit
      </h1>
      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <Products itemsToLoad={totalProducts} isEditing={true} heading="" />
      )}
    </div>
  );
}
