import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./ProductDetails.module.scss";
import spinnerImg from "../../../assets/spinner.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_QUANTITY,
  DECREASE_CART,
  selectCartItems,
} from "../../../slice/cartSlice";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import useFetchDocument from "../../../customHooks/useFetchDocument";
import Card from "../../card/Card";
import StarsRating from "react-star-rate";
export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const { document } = useFetchDocument("products", id);
  const cart = cartItems.find((cart) => cart.id === id);
  const { data } = useFetchCollection("reviews");

  const filterReviews = data.filter((review) => review.productID === id);
  const isCartAdded = cartItems.findIndex((cart) => {
    return cart.id === id;
  });

  useEffect(() => {
    // getProduct();
    setProduct(document);
  }, [document]);

  // async function getProduct() {
  //   console.log("Getting product");
  //   const docRef = doc(db, "products", id);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     // console.log("Document data:", docSnap.data());
  //     const obj = {
  //       id: id,
  //       ...docSnap.data(),
  //     };
  //     setProduct(obj);
  //   } else {
  //     toast.error("product not found");
  //   }
  // }
  const addToCart = (product) => {
    dispatch(ADD_TO_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  const decreaseCart = (product) => {
    dispatch(DECREASE_CART(product));
    dispatch(CALCULATE_TOTAL_QUANTITY());
  };

  return (
    <section>
      <div className={`container ${styles.product}`}>
        <h2>Product Details</h2>
        <div>
          <Link to="/#products"> Back TO Products</Link>
        </div>
        {product == null ? (
          <img src={spinnerImg} alt="Loading.." style={{ width: "50px" }} />
        ) : (
          <>
            <div className={styles.details}>
              <div className={styles.img}>
                <img src={product.imageURL} alt={product.name} />
              </div>
              <div className={styles.content}>
                <h3>{product.name}</h3>
                <p className={styles.proce}>{`$${product.price}`}</p>
                <p>{product.desc}</p>
                <p>
                  <b>SKU</b> {product.id}
                </p>
                <p>
                  <b>Brand</b> {product.brand}
                </p>
                <div className={styles.count}>
                  {isCartAdded < 0 ? null : (
                    <>
                      <button
                        className="--btn"
                        onClick={() => decreaseCart(product)}
                      >
                        -
                      </button>

                      <p>
                        <b>{cart?.cartQuantity || 0}</b>
                      </p>

                      <button
                        className="--btn"
                        onClick={() => addToCart(product)}
                      >
                        +
                      </button>
                    </>
                  )}
                </div>
                <button
                  className="--btn --btn-danger"
                  onClick={() => addToCart(product)}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </>
        )}
        <Card cardClass={styles.card}>
          <h3>Product Reviews</h3>
          <div>
            {filterReviews.length === 0 ? (
              <p>There are no reviews for this product yet.</p>
            ) : (
              <>
                {filteredReviews.map((item, index) => {
                  const { rate, review, reviewDate, userName } = item;
                  return (
                    <>
                      <div key={index} className={styles.review}>
                        <StarsRating value={rate} />
                        <p>{review}</p>
                        <span>
                          <b>{reviewDate}</b>
                          <br />
                        </span>
                        <span>
                          <b>by {userName}</b>
                        </span>
                      </div>
                    </>
                  );
                })}
              </>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};
