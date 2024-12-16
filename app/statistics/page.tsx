"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./page.module.css";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const options = {
  series: [
    {
      data: [
        { name: "Chair", y: 25 },
        { name: "Sofa", y: 20 },
        { name: "Table", y: 11 },
        { name: "Decor", y: 5 },
      ],
    },
  ],
};
export default function Statistics() {
  const [userCount, setUserCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [regularUsers, setRegularUserCount] = useState<number>(0);

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
        </div>
        <div className={classes.statCard}>
          <p className={classes.statLabel}>Total Products</p>
          <p className={classes.statValue}>{productCount}</p>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}></HighchartsReact>
        </div>
      </div>
    </div>
  );
}
