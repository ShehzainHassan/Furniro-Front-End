"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete, MdManageHistory } from "react-icons/md";
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
        <div className={classes.subBtnContainer}>
          <MdManageHistory />
          <button className={classes.button} onClick={toggleDropdown}>
            Manage Products
          </button>
        </div>
        {isDropdownVisible && (
          <div className={classes.dropdown}>
            <div className={classes.subBtnContainer}>
              <IoMdAddCircle />
              <button
                onClick={handleAddProduct}
                className={classes.dropdownButton}>
                Add Product
              </button>
            </div>
            <div className={classes.subBtnContainer}>
              <FaEdit />
              <button
                onClick={handleEditProduct}
                className={classes.dropdownButton}>
                Edit Product
              </button>
            </div>

            <div className={classes.subBtnContainer}>
              <MdDelete />
              <button
                onClick={handleDeleteProduct}
                className={classes.dropdownButton}>
                Delete Product
              </button>
            </div>
          </div>
        )}
        <div className={classes.subBtnContainer}>
          <ImStatsBars />
          <button onClick={handleViewStatistics} className={classes.button}>
            View Statistics
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
