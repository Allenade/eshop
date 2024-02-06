import { ProductFilter } from "./productFilter/ProductFilter";
import { ProductList } from "./productList/ProductList";
import styles from "./Product.module.scss";
import { useDispatch, useSelector } from "react-redux";
import useFetchCollection from "../../customHooks/useFetchCollection";
import { useEffect, useState } from "react";
import {
  GET_PRICE_RANGE,
  STORE_PRODUCTS,
  selectProducts,
} from "../../slice/productSlice";
import spinnerImg from "../../assets/spinner.jpg";
import { FaCogs } from "react-icons/fa";

export const Product = () => {
  const { data, isLoading } = useFetchCollection("products");
  const [showFilter, setShowFilter] = useState(false);
  const products = useSelector(selectProducts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: data,
      })
    );
    dispatch(
      GET_PRICE_RANGE({
        products: data,
      })
    );
  }, [dispatch, data]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };
  return (
    <section>
      <div className={`container ${styles.product}`}>
        <aside
          className={
            showFilter ? `${styles.filter} ${styles.show}` : `${styles.filter}`
          }
        >
          {isLoading ? null : <ProductFilter />}
        </aside>
        <div className={styles.content}>
          {isLoading ? (
            <img
              src={spinnerImg}
              alt="Loading..."
              style={{ width: "50px" }}
              className="--center-all"
            />
          ) : (
            <ProductList products={products} />
          )}
          <div className={styles.icon} onClick={() => toggleFilter()}>
            <FaCogs size={20} color="orangered" />
            <p>
              <b>{showFilter ? "Hide filter" : "show filter"}</b>
            </p>
          </div>
        </div>
      </div>
      {/* <h2>Product</h2> */}
    </section>
  );
};
