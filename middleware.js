import jwt from "jsonwebtoken";
import { NextResponse } from "next/dist/server/web/spec-extension/response";
const URL = process.env.FRONT_END_URL;
export function middleware(req) {
  const token = req.cookies.get("JWT");
  let decodedToken = null;

  if (token) {
    decodedToken = jwt.decode(token.value);
  }

  const url = req.url;
  const adminOnlyRoutes = [
    "/addProduct",
    "/addUser",
    "/adminHome",
    "/deleteProduct",
    "/deleteUser",
    "/editProduct",
    "/editUser",
    "/statistics",
  ];
  const userRoutes = [
    "/about",
    "/checkout",
    "/contact",
    "/home",
    "/shop",
    "/shop/products",
    "/shop/products/:id",
  ];

  if (
    !token &&
    (adminOnlyRoutes.some((route) => url.includes(route)) ||
      userRoutes.some((route) => url.includes(route)))
  ) {
    return NextResponse.redirect(`${URL}`);
  }
  if (token) {
    if (
      adminOnlyRoutes.some((route) => url.includes(route)) &&
      !decodedToken?.role.includes("ADMIN")
    ) {
      console.log("Admin Route = ", url);
      return NextResponse.redirect(`${URL}/home`);
    }
  }

  return NextResponse.next();
}
