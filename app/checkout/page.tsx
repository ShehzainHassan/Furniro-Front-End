"use client";
import CheckoutPage from "@/components/checkout/checkout";
import { Suspense } from "react";

export default function Checkout() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}
