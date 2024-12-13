import classes from "./loading.module.css";
export default function Loading() {
  return (
    <div className={classes.loadingContainer}>
      <div className={classes.spinner}></div>
      <p>Loading...</p>
    </div>
  );
}
