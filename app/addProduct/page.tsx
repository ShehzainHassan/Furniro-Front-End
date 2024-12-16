"use client";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import classes from "./addProduct.module.css";
const AddProduct = () => {
  const token = Cookies.get("JWT");
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "Chair",
    currentPrice: 0,
    image: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct();
  };

  const addProduct = async () => {
    console.log("Form Data = ", formData.image?.name);
    try {
      await axios.post(
        "https://furniro.up.railway.app/createProduct",
        {
          productName: formData.productName,
          description: formData.description,
          category: formData.category,
          originalPrice: formData.currentPrice,
          image: formData.image?.name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Product Created Successfully", {
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

      setTimeout(() => {
        window.location.reload();
      }, 3500);
    } catch (err) {
      console.error("Error creating product ", err);
      toast.error("Failed to create product", {
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

  return (
    <div className={classes.mainContent}>
      <h1>Manage Products {">"} Add Product</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.addProductForm}>
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            required
            placeholder="Product Name"
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
          />
          <label htmlFor="description">Description</label>
          <input
            type="text"
            required
            placeholder="Enter a brief description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <label htmlFor="price">Price (Rs)</label>
          <input
            type="number"
            required
            placeholder="Price"
            value={formData.currentPrice}
            onChange={(e) =>
              setFormData({ ...formData, currentPrice: +e.target.value })
            }
          />
          <label htmlFor="category">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }>
            <option>Chair</option>
            <option>Table</option>
            <option>Sofa</option>
            <option>Decor</option>
          </select>
          <label htmlFor="image">Image</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (file) setFormData({ ...formData, image: file });
            }}
          />
          <button type="submit">Add Product</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
