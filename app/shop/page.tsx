import Products from "@/app/shop/products/page";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export default function Shop() {
  return (
    <div>
      <Header heading="Shop" />
      <Products itemsToLoad={8} heading="" />
      <Footer />
    </div>
  );
}
