"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./products.module.css";

export interface Product {
  _id: string;
  productName: string;
  description: string;
  image: string;
  category: string;
  originalPrice: number;
  discount: number;
  isNew: boolean;
}

interface ProductProps {
  heading?: string;
  itemsToLoad?: number;
  category?: string;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export default function Products({
  heading,
  itemsToLoad = 8,
  category,
  isDeleting,
  isEditing,
}: ProductProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterBy, setFilterBy] = useState<string>("Default");
  const [totalProductsCount, setTotalProductsCount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("Default");
  const [showMore, setShowMore] = useState<boolean>(true);

  const path = usePathname();

  useEffect(() => {
    loadProducts();
  }, [filterBy, sortBy]);

  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("JWT");

  console.log("TOKEN:", token);

  const loadProducts = async () => {
    try {
      const url = "https://furniro.up.railway.app/getProducts";
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let allProducts = response.data;

      if (category) {
        allProducts = allProducts.filter(
          (p: Product) => p.category === category
        );
      }

      if (filterBy === "New Products") {
        allProducts = allProducts.filter((p: Product) => p.isNew);
      } else if (filterBy === "On Sale") {
        allProducts = allProducts.filter((p: Product) => p.discount > 0);
      } else if (filterBy === "Not On Sale") {
        allProducts = allProducts.filter((p: Product) => p.discount === 0);
      }

      if (sortBy === "Product Name (A-Z)") {
        allProducts.sort((a: Product, b: Product) =>
          a.productName.localeCompare(b.productName)
        );
      } else if (sortBy === "Product Name (Z-A)") {
        allProducts.sort((a: Product, b: Product) =>
          b.productName.localeCompare(a.productName)
        );
      } else if (sortBy === "Price (Low to High)") {
        allProducts.sort(
          (a: Product, b: Product) => a.originalPrice - b.originalPrice
        );
      } else if (sortBy === "Price (High to Low)") {
        allProducts.sort(
          (a: Product, b: Product) => b.originalPrice - a.originalPrice
        );
      }

      const slicedResponse = allProducts.slice(0, itemsToLoad);
      setTotalProductsCount(response.data.length);
      setFilteredProducts(slicedResponse);
      setProducts(allProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`https://furniro.up.railway.app/deleteProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product Deleted Successfully", {
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
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });
    }
  };
  const showMoreProducts = () => {
    setShowMore(false);
    itemsToLoad = totalProductsCount;
    loadProducts();
  };

  if (!products) {
    return null;
  }

  const calculateCurrentPrice = (originalPrice: number, discount: number) => {
    if (discount > 0) {
      return originalPrice - originalPrice * (discount / 100);
    }
    return originalPrice;
  };

  return (
    <div className={classes.pageContainer}>
      <div>
        {heading && <h1 className={classes.title}>{heading}</h1>}
        {path === "/shop" && (
          <div className={classes.productFilter}>
            <div className={classes.filter}>
              <label htmlFor="Filter By">Filter By</label>
              <select
                className={classes.filterBox}
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}>
                <option value="Default">Default</option>
                <option value="New Products">New Products</option>
                <option value="On Sale">On Sale</option>
                <option value="Not On Sale">Not On Sale</option>
              </select>
            </div>

            <div className={classes.filter}>
              <label htmlFor="Sort By">Sort By</label>
              <select
                className={classes.filterBox}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}>
                <option value="Default">Default</option>
                <option value="Product Name (A-Z)">Product Name (A-Z)</option>
                <option value="Product Name (Z-A)">Product Name (Z-A)</option>
                <option value="Price (Low to High)">Price (Low to High)</option>
                <option value="Price (High to Low)">Price (High to Low)</option>
              </select>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <p className={classes.notFound}>
            No products found matching this filter. Try changing the filter.
          </p>
        )}

        <div className={classes.container}>
          {filteredProducts.map((p, index) => {
            const calculatedPrice = calculateCurrentPrice(
              p.originalPrice,
              p.discount
            );
            return (
              <div className={classes.productContainer} key={index}>
                {!isEditing && (
                  <Link href={`/shop/products/${p._id}`}>
                    <Image
                      className={classes.image}
                      src={`/images/${p.image}`}
                      alt={p.productName}
                      width={300}
                      height={200}
                    />
                  </Link>
                )}
                {isEditing && (
                  <Link href={`/editProduct/${p._id}`}>
                    <Image
                      className={classes.image}
                      src={`/images/${p.image}`}
                      alt={p.productName}
                      width={300}
                      height={200}
                    />
                  </Link>
                )}
                <div className={classes.productDetails}>
                  <p>{p.productName}</p>
                  <p>{p.description}</p>
                  <div className={classes.price}>
                    <p>{`Rs ${calculatedPrice.toFixed(0)}`}</p>
                    {p.discount !== 0 && (
                      <p
                        className={
                          classes.originalPrice
                        }>{`Rs ${p.originalPrice.toFixed(0)}`}</p>
                    )}
                  </div>
                </div>
                {p.isNew && p.discount === 0 && (
                  <div className={classes.new}>
                    <p>New</p>
                  </div>
                )}
                {!p.isNew && p.discount > 0 && (
                  <div className={`${classes.new} ${classes.discount}`}>
                    <p>-{p.discount}%</p>
                  </div>
                )}
                {p.isNew && p.discount > 0 && (
                  <>
                    <div className={classes.new}>
                      <p>New</p>
                    </div>
                    <div
                      className={`${classes.new} ${classes.discount} ${classes.position}`}>
                      <p>-{p.discount}%</p>
                    </div>
                  </>
                )}
                {isDeleting && (
                  <div
                    onClick={() => deleteProduct(p._id)}
                    className={classes.delBtn}>
                    Delete
                  </div>
                )}
                {isEditing && (
                  <Link href={`/editProduct/${p._id}`}>
                    <div className={`${classes.delBtn} ${classes.editBtn}`}>
                      Edit Product
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showMore && (
        <button onClick={showMoreProducts} className={classes.btn}>
          Show More
        </button>
      )}
    </div>
  );
}
