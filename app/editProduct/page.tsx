"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Products from "../shop/products/page";

export default function EditProduct() {
  const [token, setToken] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const _token = localStorage.getItem("JWT");
      setToken(_token);
    }
  }, []);

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

  useEffect(() => {
    loadProducts();
  }, []);

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
