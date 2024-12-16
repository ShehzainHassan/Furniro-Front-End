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
    color: string;
  }
  interface UserRole {
    role: "USER" | "ADMIN";
  }

  interface ProductCategory {
    category: "Chair" | "Sofa" | "Table" | "Decor";
  }
  const [userCount, setUserCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
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
      setUserCategory(response.data.length);
      const categoryCount: { [key: string]: number } = {};

      response.data.forEach((user: UserRole) => {
        const role = user.role;
        categoryCount[role] = (categoryCount[role] || 0) + 1;
      });

      setUserCategory([
        { name: "USER", y: categoryCount["USER"] || 0, color: "#434348" },
        { name: "ADMIN", y: categoryCount["ADMIN"] || 0, color: "#676cd0" },
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
        { name: "Chair", y: categoryCount["Chair"] || 0, color: "#7cb6ec" },
        { name: "Sofa", y: categoryCount["Sofa"] || 0, color: "#cbba3b" },
        { name: "Table", y: categoryCount["Table"] || 0, color: "#77d464" },
        { name: "Decor", y: categoryCount["Decor"] || 0, color: "#676cd0" },
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
    title: {
      text: "Products Info",
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
    title: {
      text: "Users Info",
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
      <div className={classes.statsWrappe}>
        <div className={classes.statCard}>
          <p className={classes.statLabel}>Registered Users</p>
          <p className={classes.statValue}>{userCount}</p>

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
