import classes from "./page.module.css";

export default function Contact() {
  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>Contact Us</h1>
      <form className={classes.form}>
        <input
          required
          type="text"
          className={classes.input}
          placeholder="Your Name"
        />
        <input
          type="email"
          required
          className={classes.input}
          placeholder="Your Email"
        />
        <textarea
          required
          className={classes.textarea}
          placeholder="Your Message"
        />
        <button type="submit" className={classes.button}>
          Send Message
        </button>
      </form>
    </div>
  );
}
