/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Card from "../../card/Card";
import styles from "./ProductItem.module.scss";
import { useDispatch } from "react-redux";
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_QUANTITY,
} from "../../../slice/cartSlice";
CALCULATE_TOTAL_QUANTITY;
export const ProductItem = ({
  product,
  grid,
  id,
  name,
  price,
  desc,
  imageURL,
}) => {
  const dispatch = useDispatch();
  function shortenText(text, n) {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  }
  const addToCart = (product) => {
    console.log(product); // Debugging

    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };
  return (
    <Card cardClass={grid ? `${styles.grid}` : `${styles.list}`}>
      <Link to={`/product-details/${id}`}>
        <div className={styles.img}>
          <img src={imageURL} alt={name} />
        </div>
      </Link>
      <div className={styles.content}>
        <div className={styles.details}>
          <p>{`$${price}`}</p>
          <h4>{shortenText(name, 18)}</h4>
        </div>
        {!grid && <p className={styles.desc}>{shortenText(desc, 200)}</p>}
        <button
          className="--btn --btn-danger"
          onClick={() => addToCart(product)}
        >
          Add To Cart
        </button>
      </div>
    </Card>
  );
};
