import classes from "./page.module.css";

export default function About() {
  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>About Us</h1>
      <p className={classes.description}>
        Welcome to our furniture store, where we offer a wide range of furniture
        for your home and office needs.
      </p>
    </div>
  );
}
