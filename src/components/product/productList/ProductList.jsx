/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "./ProductList.module.scss";
import { IoGridSharp } from "react-icons/io5";
import { FaListAlt } from "react-icons/fa";
import Search from "../../search/Search";
import { ProductItem } from "../productItem/ProductItem";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_BY_SEARCH,
  SORT_PRODUCTS,
  selectFilterProducts,
} from "../../../slice/filterSlice";
import Pagination from "../../pagination/Pagination";

export const ProductList = ({ products }) => {
  const [grid, setGrid] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const filteredProducts = useSelector(selectFilterProducts);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9);
  // Get Currrnet products

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currnetProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(SORT_PRODUCTS({ products, sort }));
  }, [dispatch, products, sort]);

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH({ products, search }));
  }, [dispatch, products, search]);

  return (
    <div className={styles["product-list"]} id="product">
      <div className={styles.top}>
        <div className={styles.icons}>
          <IoGridSharp
            size={22}
            color="orangered"
            onClick={() => setGrid(true)}
          />
          <FaListAlt size={24} color="#0066d4" onClick={() => setGrid(false)} />

          <p>
            <b>{filteredProducts.length}</b> Product found.
          </p>
        </div>
        {/* {search icon} */}
        <div>
          <Search value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={styles.sort}>
          <label>Sort by:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="lowest-price">Lowest Price</option>
            <option value="highest-price">Highest-price</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>
      </div>
      <div className={grid ? `${styles.grid}` : `${styles.list}`}>
        {products.length === 0 ? (
          <p>No producr found.</p>
        ) : (
          <>
            {currnetProducts.map((product) => {
              return (
                <div key={product.id}>
                  <ProductItem {...product} grid={grid} product={product} />
                </div>
              );
            })}
          </>
        )}
      </div>
      <Pagination
        productsPerPage={productsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalProducts={filteredProducts.length}
      />
    </div>
  );
};
