"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineUserDelete } from "react-icons/ai";
import { BiUserPlus } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete, MdManageHistory } from "react-icons/md";
import classes from "./adminDashboard.module.css";

const AdminDashboard = () => {
  const [isProductDropdownVisible, setProductDropdownVisible] = useState(false);
  const [isUserDropdownVisible, setUserDropdownVisible] = useState(false);
  const router = useRouter();

  const toggleProductDropdown = () => {
    setProductDropdownVisible(!isProductDropdownVisible);
  };

  const toggleUserDropdown = () => {
    setUserDropdownVisible(!isUserDropdownVisible);
  };

  const handleViewStatistics = () => {
    router.push("/statistics");
  };
  const handleAddProduct = () => {
    router.push("/addProduct");
  };

  const handleEditProduct = () => {
    router.push("/editProduct");
  };

  const handleDeleteProduct = () => {
    router.push("/deleteProduct");
  };

  const handleAddUser = () => {
    router.push("/addUser");
  };

  const handleEditUser = () => {
    // router.push("/editUser");
  };

  const handleDeleteUser = () => {
    router.push("/deleteUser");
  };

  return (
    <div className={classes.dashboardContainer}>
      <h1 className={classes.title}>Admin Dashboard</h1>
      <div className={classes.buttonsContainer}>
        <button className={classes.button} onClick={toggleProductDropdown}>
          <MdManageHistory /> Manage Products
        </button>
        {isProductDropdownVisible && (
          <div className={classes.dropdown}>
            <button
              onClick={handleAddProduct}
              className={classes.dropdownButton}>
              <IoMdAddCircle /> Add Product
            </button>
            <button
              onClick={handleEditProduct}
              className={classes.dropdownButton}>
              <FaEdit /> Edit Product
            </button>
            <button
              onClick={handleDeleteProduct}
              className={`${classes.dropdownButton} ${classes.delete}`}>
              <MdDelete /> Delete Product
            </button>
          </div>
        )}

        <button className={classes.button} onClick={toggleUserDropdown}>
          <MdManageHistory /> Manage Users
        </button>
        {isUserDropdownVisible && (
          <div className={classes.dropdown}>
            <button onClick={handleAddUser} className={classes.dropdownButton}>
              <BiUserPlus /> Add User
            </button>
            <button onClick={handleEditUser} className={classes.dropdownButton}>
              <FaEdit /> Edit User
            </button>
            <button
              onClick={handleDeleteUser}
              className={`${classes.dropdownButton} ${classes.delete}`}>
              <AiOutlineUserDelete /> Delete User
            </button>
          </div>
        )}
        <button onClick={handleViewStatistics} className={classes.button}>
          <ImStatsBars /> View Statistics
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
