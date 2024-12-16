"use client";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import classes from "./page.module.css";

export default function Statistics() {
  interface CategoryData {
    name: string;
    y: number;
  }
  interface UserRole {
    role: "USER" | "ADMIN";
  }

  interface ProductCategory {
    category: "Chair" | "Sofa" | "Table" | "Decor";
  }
  const [userCount, setUserCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [regularUsers, setRegularUserCount] = useState<number>(0);
  const [productCategory, setProductCategory] = useState<CategoryData[]>([]);
  const [userCategory, setUserCategory] = useState<CategoryData[]>([]);
  const loadUserCount = async () => {
    try {
      const response = await axios.get(
        "https://furniro.up.railway.app/getAllUsers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserCount(response.data.length);
      setRegularUserCount(response.data.length - 1);
      setUserCategory(response.data.length);
      const categoryCount: { [key: string]: number } = {};

      response.data.forEach((user: UserRole) => {
        const role = user.role;
        categoryCount[role] = (categoryCount[role] || 0) + 1;
      });

      setUserCategory([
        { name: "USER", y: categoryCount["USER"] || 0 },
        { name: "ADMIN", y: categoryCount["ADMIN"] || 0 },
      ]);
    } catch (err) {
      console.error("Error loading users", err);
    }
  };
  const loadProductCount = async () => {
    try {
      const response = await axios.get(
        "https://furniro.up.railway.app/getAllProducts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProductCount(response.data.length);
      const categoryCount: { [key: string]: number } = {};

      response.data.forEach((product: ProductCategory) => {
        const category = product.category;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      setProductCategory([
        { name: "Chair", y: categoryCount["Chair"] || 0 },
        { name: "Sofa", y: categoryCount["Sofa"] || 0 },
        { name: "Table", y: categoryCount["Table"] || 0 },
        { name: "Decor", y: categoryCount["Decor"] || 0 },
      ]);
    } catch (err) {
      console.error("Error loading users", err);
    }
  };
  useEffect(() => {
    loadUserCount();
    loadProductCount();
  }, []);
  if (typeof window == "undefined") return null;
  const token = localStorage.getItem("JWT");

  const productOptions = {
    chart: {
      type: "pie",
    },
    series: [
      {
        type: "pie",
        data: productCategory,
      },
    ],
  };

  const userOptions = {
    chart: {
      type: "bar",
    },
    series: [
      {
        type: "bar",
        data: userCategory,
      },
    ],
  };
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Statistics</h1>
      <div className={classes.statsWrapper}>
        <div className={classes.statCard}>
          <p className={classes.statLabel}>Registered Users</p>
          <p className={classes.statValue}>{userCount}</p>
          <div className={classes.userBreakDown}>
            <div className={classes.regularUsers}>
              <p>{regularUsers}</p>
              <p>Regular Users</p>
            </div>
            <div className={`${classes.regularUsers} ${classes.adminUser}`}>
              <p>1</p>
              <p>Admin User</p>
            </div>
          </div>
          <HighchartsReact
            highcharts={Highcharts}
            options={userOptions}></HighchartsReact>
        </div>
        <div className={classes.statCard}>
          <p className={classes.statLabel}>Total Products</p>
          <p className={classes.statValue}>{productCount}</p>
          <HighchartsReact
            highcharts={Highcharts}
            options={productOptions}></HighchartsReact>
        </div>
      </div>
    </div>
  );
}
