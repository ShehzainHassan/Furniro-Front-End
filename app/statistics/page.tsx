"use client";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import classes from "./page.module.css";
import Cookies from "js-cookie";
const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

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
    category: "Chair" | "Sofa" | "Table" | "Bed" | "Decor" | "Other";
  }
  const [userCount, setUserCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [productCategory, setProductCategory] = useState<CategoryData[]>([]);
  const [userCategory, setUserCategory] = useState<CategoryData[]>([]);
  const loadUserCount = async () => {
    try {
      const response = await axios.get(`${BACKEND_API}/getAllUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserCount(response.data.length);
      setUserCategory(response.data.length);
      const categoryCount: { [key: string]: number } = {};

      response.data.forEach((user: UserRole) => {
        const role = user.role;
        categoryCount[role] = (categoryCount[role] || 0) + 1;
      });

      setUserCategory([
        { name: "USER", y: categoryCount["USER"] || 0, color: "#34b8b8" },
        { name: "ADMIN", y: categoryCount["ADMIN"] || 0, color: "#b94f6e" },
      ]);
    } catch (err) {
      console.error("Error loading users", err);
    }
  };
  const loadProductCount = async () => {
    try {
      const response = await axios.get(`${BACKEND_API}/getAllProducts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProductCount(response.data.length);
      const categoryCount: { [key: string]: number } = {};

      response.data.forEach((product: ProductCategory) => {
        const category = product.category;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      setProductCategory([
        { name: "Chair", y: categoryCount["Chair"] || 0, color: "#7c7cf9" },
        { name: "Sofa", y: categoryCount["Sofa"] || 0, color: "#f0ad4e" },
        { name: "Table", y: categoryCount["Table"] || 0, color: "#5bc0de" },
        { name: "Bed", y: categoryCount["Bed"] || 0, color: "#ddff00" },
        { name: "Decor", y: categoryCount["Decor"] || 0, color: "#5cb85c" },
        { name: "Other", y: categoryCount["Other"] || 0, color: "#000000" },
      ]);
    } catch (err) {
      console.error("Error loading products", err);
    }
  };
  useEffect(() => {
    loadUserCount();
    loadProductCount();
  }, []);
  if (typeof window == "undefined") return null;
  const token = Cookies.get("JWT");

  const productOptions = {
    chart: {
      type: "pie",
      backgroundColor: "#f7f7f7",
      borderRadius: 10,
    },
    title: {
      text: "Products Info",
      style: { fontSize: "18px", fontWeight: "bold", color: "#333" },
    },
    tooltip: {
      pointFormat: "<b>{point.name}</b>: {point.y} Products",
      backgroundColor: "#e0e0e0",
      borderColor: "#c1c1c1",
      style: {
        fontSize: "14px",
      },
    },
    series: [
      {
        type: "pie",
        data: productCategory,
        size: "70%",
        innerSize: "40%",
        showInLegend: true,
        dataLabels: {
          enabled: false,
        },
      },
    ],
    plotOptions: {
      pie: {
        borderWidth: 2,
        borderColor: "#fff",
        dataLabels: {
          style: {
            color: "#fff",
            fontSize: "14px",
            fontWeight: "bold",
          },
        },
      },
    },
  };

  const userOptions = {
    chart: {
      type: "bar",
      backgroundColor: "#f7f7f7",
    },
    title: {
      text: "Users Info",
      style: { fontSize: "18px", fontWeight: "bold", color: "#333" },
    },
    xAxis: {
      categories: ["USER", "ADMIN"],
      title: {
        text: null,
      },
    },
    yAxis: {
      title: {
        text: "Number of Users",
      },
      min: 0,
    },
    tooltip: {
      pointFormat: "<b>{point.name}</b>: {point.y} Users",
      backgroundColor: "#e0e0e0",
      borderColor: "#c1c1c1",
      style: {
        fontSize: "14px",
      },
    },
    series: [
      {
        type: "bar",
        data: userCategory,
        color: "#34b8b8",
        borderRadius: 5,
        dataLabels: {
          enabled: true,
          format: "{point.y}",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#fff",
          },
        },
      },
    ],
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Statistics</h1>
      <div className={classes.statsWrapper}>
        <div className={classes.statCard}>
          <div>
            <p className={classes.statLabel}>Registered Users</p>
            <p className={classes.statValue}>{userCount}</p>
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
