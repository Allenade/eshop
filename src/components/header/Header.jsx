import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { FaShoppingCart, FaTimes, FaUserCircle } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_ACTIVE_USER, SET_ACTIVE_USER } from "../../slice/authSlice";
import ShowOnLogin, { ShowOnLogout } from "../hiddenLinks/HiddenLinks";
import { AdminLink } from "../adminRoute/AdminRoute";
import {
  CALCULATE_TOTAL_QUANTITY,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from "../../slice/cartSlice";

const logo = (
  <div className={styles.logo}>
    <Link to="/">
      <h2>
        e<span>Shop</span>.
      </h2>
    </Link>
  </div>
);

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");
const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [disPlayName, setDisPlayName] = useState("");
  const [scrollPage, setScrollPage] = useState(false);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);

  useEffect(() => {
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, []);
  const navigate = useNavigate();

  const dispatch = useDispatch({});

  const fixNavbar = () => {
    if (window.scrollY > 50) {
      setScrollPage(true);
    } else {
      setScrollPage(false);
    }
  };
  window.addEventListener("scroll", fixNavbar);

  function toggleMenu() {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  }
  function hideMenu() {
    setShowMenu(false);
  }
  // monitore currently signed in user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // const uid = user.uid;
        // console.log(user.displayName);
        if (user.displayName == null) {
          const u1 = user.email.substring(0, user.email.indexOf("@"));
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          // console.log(uName);
          setDisPlayName(uName);
        } else {
          setDisPlayName(user.displayName);
        }

        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: user.displayName ? user.displayName : disPlayName,
            userID: user.uid,
          })
        );
        // ...
      } else {
        // User is signed out
        // ...
        setDisPlayName("");
        dispatch(REMOVE_ACTIVE_USER());
      }
    });
  }, [dispatch, disPlayName]);
  function logoutUser() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success("Logout sucessfully");
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        toast.error(error.message);
      });
  }
  const cart = (
    <span className={styles.cart}>
      <Link to="/cart">
        Cart <FaShoppingCart size={20} />
        <p>{cartTotalQuantity}</p>
      </Link>
    </span>
  );

  return (
    <header className={scrollPage ? `${styles.fixed}` : null}>
      <div className={styles.header}>
        {logo}
        <nav
          className={
            showMenu ? `${styles["show-nav"]}` : `${styles["hide-menu"]}`
          }
        >
          <div
            className={
              showMenu
                ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
                : `${styles["nav-wrapper"]}`
            }
            onClick={hideMenu}
          >
            {" "}
          </div>

          <ul onClick={hideMenu}>
            <li className={styles["logo-mobile"]}>
              {logo}
              <FaTimes size={22} onClick={hideMenu} color="#fff" />
            </li>
            <li>
              <AdminLink>
                <Link to="/admin/home">
                  <button className="--btn --btn-primary">Admin</button>
                </Link>
              </AdminLink>
            </li>
            <li>
              <NavLink to="/" className={activeLink}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className={activeLink} to="/contact">
                Contact Us
              </NavLink>
            </li>
          </ul>

          <div className={styles["header-right"]} onClick={hideMenu}>
            <span className={styles.links}>
              <ShowOnLogin>
                <NavLink className={activeLink} to="/order-history">
                  My Orders
                </NavLink>
              </ShowOnLogin>
              <ShowOnLogout>
                <NavLink className={activeLink} to="/login">
                  Login
                </NavLink>
              </ShowOnLogout>
              <ShowOnLogin>
                <a href="#" style={{ color: "#ff7722" }}>
                  <FaUserCircle size={16} />
                  Hi,{disPlayName}
                </a>
              </ShowOnLogin>

              <ShowOnLogin>
                <NavLink to="/" onClick={logoutUser}>
                  Logout
                </NavLink>
              </ShowOnLogin>
            </span>

            {cart}
          </div>
        </nav>

        <div className={styles["menu-icon"]}>
          {cart}
          <HiOutlineMenuAlt3 onClick={toggleMenu} size={28} />
        </div>
      </div>
    </header>
  );
};

export default Header;
