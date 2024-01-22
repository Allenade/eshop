import Card from "../../components/card/Card";
import resetImg from "../../assets/undraw_forgot_password_re_hxwm.svg";
import { Link } from "react-router-dom";
import styles from "./auth.module.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import Loader from "../../components/loader/Loader";
const Reset = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setisLoading] = useState(false);

  function resetPassword(e) {
    e.preventDefault();
    setisLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        setisLoading(false);
        // ..
        toast.success("check your email for a reset link");
      })
      .catch((error) => {
        setisLoading(false);

        toast.error(error.message);
        // ..
      });
  }
  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <div className={styles.img}>
          <img src={resetImg} alt="resetImg" width="400" />
        </div>
        <Card>
          <div className={styles.form}>
            <h2>Login </h2>
            <form onSubmit={resetPassword}>
              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="--btn --btn-primary --btn-block" type="submit">
                Reset Password
              </button>
              <div className={styles.links}>
                <p>
                  <Link to="/login"> -Login</Link>
                </p>
                <p>
                  <Link to="/register">Register</Link>
                </p>
              </div>
            </form>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Reset;
