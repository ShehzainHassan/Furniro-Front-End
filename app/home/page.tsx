import Banner from "@/components/banner/banner";
import Browse from "@/components/browse/browse";
import Footer from "@/components/footer/footer";
import Products from "../shop/products/page";

export const metadata = {
  title: "Furniro",
  description: "Browse the products",
};

export default function Dashboard() {
  return (
    <div>
      <Banner
        subHeading="New Arrival"
        title="Discover Our New Collection"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis"
      />
      <Browse />
      <Products heading="Our Products" />
      <Footer />
    </div>
  );
}
