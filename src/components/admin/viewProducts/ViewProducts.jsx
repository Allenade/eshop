import { useEffect, useState } from "react";
import styles from "./ViewProducts.module.scss";
import { toast } from "react-toastify";
import { db, storage } from "../../../firebase/config";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  snapshotEqual,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Loader from "../../loader/Loader";
import { deleteObject, ref } from "firebase/storage";

const ViewProducts = () => {
  const [product, setProduct] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);
  function getProducts() {
    setisLoading(true);
    try {
      const productRef = collection(db, "products");
      const q = query(productRef, orderBy("createdAt", "desc"));

      onSnapshot(q, (snapshot) => {
        // console.log(snapshot.docs);
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(allProducts);
        setProduct(allProducts);
      });
    } catch (error) {
      setisLoading(false);
      toast.error(error.message);
    }
  }
  async function deleteProduct(id, imageURL) {
    try {
      await deleteDoc(doc(db, "products", id));
      const storageRef = ref(storage, imageURL);
      await deleteObject(storageRef);
      toast.success("product deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <>
      {/* {isLoading && <Loader />} */}
      <div className={styles.table}>
        <h1>viewProducts</h1>
        {product.length === 0 ? (
          <p>No product found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>

                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {product.map((product, index) => {
                const { id, name, price, imageURl, category } = product;
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={imageURl}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{name}</td>
                    <td>{category}</td>
                    <td>{`$${price}`}</td>
                    <td className={styles.icons}>
                      <Link to="/admin/add-product">
                        <FaEdit size={20} color="green" />
                      </Link>
                      &nbsp;
                      <FaTrashAlt
                        size={18}
                        color="red"
                        onClick={() => deleteProduct(id, imageURl)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ViewProducts;
