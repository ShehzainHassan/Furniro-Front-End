import bedRoom from "@/public/images/bedroom.png";
import dining from "@/public/images/dining.png";
import livingRoom from "@/public/images/living-room.png";
import Image from "next/image";
import classes from "./browse.module.css";

export default function Browse() {
  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <h1>Browse The Range</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
      </div>
      <div className={classes.rooms}>
        <Image className={classes.roomImg} src={dining} alt="dining" />
        <p className={classes.mobile}>Dining</p>
        <Image className={classes.roomImg} src={livingRoom} alt="livingRoom" />
        <p className={classes.mobile}>Living</p>
        <Image className={classes.roomImg} src={bedRoom} alt="bed-room" />
        <p className={classes.mobile}>Bedroom</p>
      </div>
      <div className={`${classes.rooms} ${classes.names}`}>
        <p>Dining</p>
        <p>Living</p>
        <p>Bedroom</p>
      </div>
    </div>
  );
}
