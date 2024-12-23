"use client";
import { Product } from "@/app/shop/products/page";
import axios from "axios";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./page.module.css";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export default function EditProductPage() {
  const [isDiscount, setIsDiscount] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const pathname = usePathname();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const id = pathname.split("/").pop();

  useEffect(() => {
    loadSelectedProduct();
  }, []);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "Chair",
    currentPrice: 0,
    image: null as File | null,
  });

  const loadSelectedProduct = async () => {
    try {
      const response = await axios.get(`${BACKEND_API}/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProduct(response.data);

      setFormData({
        productName: response.data.productName || "",
        description: response.data.description || "",
        category: response.data.category || "Chair",
        currentPrice: response.data.originalPrice || 0,
        image: response.data.image || null,
      });

      if (response.data.discount > 0) {
        setIsDiscount(true);
        setDiscountPercentage(response.data.discount);
      } else {
        setIsDiscount(false);
        setDiscountPercentage(0);
      }
      if (response.data.isNew) {
        setIsNew(true);
      } else {
        setIsNew(false);
      }

      console.log("Response = ", response.data);
    } catch (err) {
      console.error("Error loading product details ", err);
    }
  };

  if (typeof window == "undefined") return null;
  const token = Cookies.get("JWT");

  if (!selectedProduct) {
    return null;
  }
  const updateProduct = async () => {
    try {
      await axios.put(
        `${BACKEND_API}/updateProduct/${id}`,
        {
          productName: formData.productName,
          description: formData.description,
          image: formData.image,
          category: formData.category,
          originalPrice: formData.currentPrice,
          discount: isDiscount ? discountPercentage : 0,
          isNew: isNew,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
      toast.success("Product Updated Successfully", {
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
    } catch (err) {
      console.error("Error updating product", err);
      toast.error("Error updating product", {
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !formData.productName ||
      !formData.description ||
      !formData.currentPrice
    ) {
      toast.error("Please fill in all required fields", {
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
      return;
    }

    updateProduct();
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 100) {
      setDiscountPercentage(value);
      setIsDiscount(value > 0);
    } else {
      setDiscountPercentage(0);
      setIsDiscount(false);
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Editing Product</h1>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.inputGroup}>
          <label htmlFor="name" className={classes.label}>
            Product Name
          </label>
          <input
            type="text"
            required
            placeholder="Enter updated product name"
            className={classes.input}
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
          />
        </div>

        <div className={classes.inputGroup}>
          <label htmlFor="description" className={classes.label}>
            Description
          </label>
          <input
            type="text"
            required
            placeholder="Enter updated description"
            className={classes.input}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className={classes.inputGroup}>
          <label htmlFor="price" className={classes.label}>
            Price
          </label>
          <input
            type="number"
            required
            placeholder="Enter updated price"
            className={classes.input}
            value={formData.currentPrice}
            onChange={(e) =>
              setFormData({ ...formData, currentPrice: +e.target.value })
            }
          />
        </div>

        <div className={classes.inputGroup}>
          <label htmlFor="category" className={classes.label}>
            Category
          </label>
          <select
            className={classes.input}
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }>
            <option>Chair</option>
            <option>Table</option>
            <option>Sofa</option>
            <option>Bed</option>
            <option>Decor</option>
            <option>Other</option>
          </select>
        </div>

        <div className={classes.inputGroup}>
          <label htmlFor="image" className={classes.label}>
            Select Updated Image
          </label>
          <input
            type="file"
            accept="image/*"
            className={classes.input}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFormData({ ...formData, image: file });
            }}
          />
        </div>

        <div className={classes.inputGroup}>
          <label className={classes.label}>Discount Percentage</label>
          <input
            type="number"
            placeholder="Enter discount percentage (0-100)"
            min="0"
            max="100"
            className={classes.input}
            value={discountPercentage}
            onChange={handleDiscountChange}
          />
        </div>

        <div className={classes.toggleGroup}>
          <label className={classes.label}>Is New Product</label>
          <div className={classes.toggle}>
            <label className={classes.radioLabel}>
              <input
                type="radio"
                name="isNew"
                checked={isNew === true}
                onChange={() => setIsNew(true)}
              />
              Yes
            </label>
            <label className={classes.radioLabel}>
              <input
                type="radio"
                name="isNew"
                checked={isNew === false}
                onChange={() => setIsNew(false)}
              />
              No
            </label>
          </div>
        </div>

        <button type="submit" className={classes.submitBtn}>
          Save Changes
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
