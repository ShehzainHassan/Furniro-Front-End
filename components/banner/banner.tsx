import banner from "@/public/images/banner.png";
import Image from "next/image";
import Link from "next/link";
import classes from "./banner.module.css";

export default function Banner() {
  return (
    <div>
      <Image className={classes.banner} src={banner} alt="banner" priority />
      <div className={classes.new}>
        <div className={classes.newDescription}>
          <p>New Arrival</p>
          <h1 className={classes.title}>Discover Our New Collection</h1>
          <p className={classes.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis
          </p>
        </div>
        <Link href="/shop">
          <button className={classes.btn}>BUY NOW</button>
        </Link>
      </div>
    </div>
  );
}
