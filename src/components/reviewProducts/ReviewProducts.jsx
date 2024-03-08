import { useSelector } from "react-redux";
import styles from "./ReviewProducts.module.scss";
import { selectProducts } from "../../slice/productSlice";
import { selectUserID, selectUserName } from "../../slice/authSlice";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Card from "../card/Card";
import StarsRating from "react-star-rate";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-toastify";
import useFetchDocument from "../../customHooks/useFetchDocument";
import spinnerImg from "../../assets/spinner.jpg";

const ReviewProducts = () => {
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState("");
  const [product, setProduct] = useState(null);

  const { id } = useParams();
  const { document } = useFetchDocument("products", id);
  const products = useSelector(selectProducts);
  const userID = useSelector(selectUserID);
  const userName = useSelector(selectUserName);
  useEffect(() => {
    setProduct(document);
  }, [document]);
  //   const product = products.find((item) => item.id === id);

  const submitReview = async (e) => {
    e.preventDefault();
    // console.log(rate, review);
    const today = new Date();
    const date = today.toDateString();
    const reviewConfig = {
      // createAt: Timestamp.now().toDate(),
      userID,
      userName,
      productID: id,
      rate,
      review,
      reviewDate: date,
      createdAt: Timestamp.now().toDate(),
    };

    try {
      await addDoc(collection(db, "reviews"), reviewConfig);
      toast.success("Review submitted successfully");
      setRate(0);
      setReview("");
    } catch (error) {
      toast.error("Failed to save review");
    }
  };
  return (
    <section>
      <div className={`container ${styles.review}`}>
        <h2>Review Products</h2>
        {product === null ? (
          <img src={spinnerImg} alt="Loading..." style={{ width: "50px" }} />
        ) : (
          <>
            <p>
              <b>Product name:</b> {product.name}
            </p>
            <img
              src={product.imageURL}
              alt={product.name}
              style={{ width: "100px" }}
            />
          </>
        )}

        <Card cardClass={styles.card}>
          <form onSubmit={(e) => submitReview(e)}>
            <label>Rating:</label>
            <StarsRating
              value={rate}
              onChange={(rate) => {
                setRate(rate);
              }}
            />
            <label>Review</label>
            <textarea
              value={review}
              required
              cols="30"
              rows="10"
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
            <button type="submit" className="--btn --btn-primary">
              Submit Review
            </button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default ReviewProducts;
