import axios from "axios";
import Cookies from "js-cookie";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export const redirectToHome = async (token: string) => {
  const userInfo = await userDetails(token);
  const userEmail = userInfo.email;
  try {
    const response = await axios.get(
      `${BACKEND_API}/getUserRole?email=${userEmail}`
    );
    if (response.data.includes("ADMIN")) {
      window.location.href = "/adminHome";
    } else {
      window.location.href = "/home";
    }
  } catch (err) {
    console.error("Error redirecting to Home: ", err);
  }
};

export const userDetails = async (token: string) => {
  try {
    const response = await axios.get(
      `${BACKEND_API}/auth/userInfo?token=${token}`
    );
    return response.data;
  } catch (err) {
    console.error("Error getting user details ", err);
  }
};
