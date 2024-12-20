import axios from "axios";
import Cookies from "js-cookie";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export const redirectToHome = async () => {
  const userEmail = Cookies.get("loggedEmail");
  if (!userEmail) {
    return;
  }

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
