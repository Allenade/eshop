import { ProductFilter } from "./productFilter/ProductFilter";
import { ProductList } from "./productList/ProductList";
import styles from "./Product.module.scss";
import { useDispatch, useSelector } from "react-redux";
import useFetchCollection from "../../customHooks/useFetchCollection";
import { useEffect } from "react";
import { STORE_PRODUCTS, selectProducts } from "../../slice/productSlice";
import spinnerImg from "../../assets/spinner.jpg";
export const Product = () => {
  const { data, isLoading } = useFetchCollection("products");

  const products = useSelector(selectProducts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      STORE_PRODUCTS({
        products: data,
      })
    );
  }, [dispatch, data]);
  return (
    <section>
      <div className={`container ${styles.product}`}>
        <aside className={styles.filter}>
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
        </div>
      </div>
      <h2>Product</h2>
    </section>
  );
};
