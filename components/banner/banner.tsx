import banner from "@/public/images/banner.png";
import Image from "next/image";
import Link from "next/link";
import classes from "./banner.module.css";

interface BannerProps {
  subHeading?: string;
  title?: string;
  description?: string;
}
export default function Banner({
  subHeading,
  title,
  description,
}: BannerProps) {
  return (
    <div>
      <Image className={classes.banner} src={banner} alt="banner" priority />
      <div className={classes.new}>
        <div className={classes.newDescription}>
          <p>{subHeading}</p>
          <h1 className={classes.title}>{title}</h1>
          <p className={classes.description}>{description}</p>
        </div>
        <Link href="/shop">
          <button className={classes.btn}>BUY NOW</button>
        </Link>
      </div>
    </div>
  );
}
