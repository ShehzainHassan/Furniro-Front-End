import logoImg from "@/public/images/logo-img.png";
import ShopBanner from "@/public/images/sub-banner.png";
import Image from "next/image";
import classes from "./header.module.css";
interface HeaderProps {
  heading: string;
}
export default function Header({ heading }: HeaderProps) {
  return (
    <div>
      <Image className={classes.bannerImg} src={ShopBanner} alt="banner-img" />
      <div className={classes.heading}>
        <Image className={classes.logoImg} src={logoImg} alt="logo" />
        <h1 className={classes.mainHeading}>{heading}</h1>
        <p className={classes.subHeading}>
          <span className={classes.bold}>Home {">"} </span> {heading}
        </p>
      </div>
    </div>
  );
}
