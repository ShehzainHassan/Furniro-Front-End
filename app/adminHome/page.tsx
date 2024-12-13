"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import classes from "./adminDashboard.module.css";

const AdminDashboard = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };
  const handleDeleteProduct = () => {
    router.push("/deleteProduct");
  };

  const handleAddProduct = () => {
    router.push("/addProduct");
  };

  const handleViewStatistics = () => {
    router.push("/statistics");
  };
  const handleEditProduct = () => {
    router.push("/editProduct");
  };
  return (
    <div className={classes.dashboardContainer}>
      <h1 className={classes.title}>Admin Home Page</h1>
      <div className={classes.buttonsContainer}>
        <button className={classes.button} onClick={toggleDropdown}>
          Manage Products
        </button>
        {isDropdownVisible && (
          <div className={classes.dropdown}>
            <button
              onClick={handleAddProduct}
              className={classes.dropdownButton}>
              Add Product
            </button>
            <button
              onClick={handleEditProduct}
              className={classes.dropdownButton}>
              Edit Product
            </button>
            <button
              onClick={handleDeleteProduct}
              className={classes.dropdownButton}>
              Delete Product
            </button>
          </div>
        )}
        <button onClick={handleViewStatistics} className={classes.button}>
          View Statistics
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
