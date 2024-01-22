import loaderImg from "../../assets/giphy.gif";
import styles from "./Loader.module.scss";
import ReactDom from "react-dom";
const Loader = () => {
  return ReactDom.createPortal(
    <div className={styles.wrapper}>
      <div className={styles.loader}>
        <img src={loaderImg} alt="Loading..." />
      </div>
    </div>,
    document.getElementById("loader")
  );
};

export default Loader;
