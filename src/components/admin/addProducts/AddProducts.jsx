import { useState } from "react";
import styles from "./AddProducts.module.scss";
import Card from "../../card/Card";
import { db, storage } from "../../../firebase/config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../loader/Loader";
import { useSelector } from "react-redux";
import { selectProducts } from "../../../slice/productSlice";
const category = [
  { id: 1, name: "Laptop" },

  { id: 2, name: "Electronics" },
  { id: 3, name: "Fashion" },
  { id: 4, name: "Phone" },
];

const initialState = {
  name: "",
  imageURL: "",
  price: 0,
  category: "",
  brand: "",
  desc: "",
};
const AddProducts = () => {
  const { id } = useParams();
  const products = useSelector(selectProducts);

  const productEdit = products?.find((item) => item.id === id);

  
  const [product, setProduct] = useState(() => {
    const newState = detectForm(
      id,

      { ...initialState },
      productEdit
    );
    return newState;
  });

  const [upLoadProgress, setUpLoadProgress] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();

  function detectForm(id, f1, f2) {
    if (id === "ADD") {
      return f1;
    }
    return f2;
  }
  function handleInputChange(e) {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  }

 async  function handleImageChange(e) {
    const file = e.target.files[0];
    // console.log(file);
    const storageRef = ref(storage, `e-shop/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
// https://firebasestorage.googleapis.com/v0/b/eshop-6e4a9.appspot.com/o/e-shop%2F1706486140895Screenshot%20from%202024-01-26%2013-39-45.png?alt=media&token=47f05b82-5e3c-4f5e-a527-247a7f701158
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        setUpLoadProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        toast.error(error.message);
      },
      async () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProduct({ ...product, imageURL: downloadURL });
          toast.success("Image uploaded successfully.");
        });
      }
    );
  }

  const addProduct = async (e) => {
    e.preventDefault();
    setisLoading(true);
    // console.log(product);
    try {
      // Add a new document with a generated id.
       await addDoc(collection(db, "products"), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createdAt: Timestamp.now().toDate(),
      });
      setisLoading(false);
      setUpLoadProgress(0);
      setProduct({ ...initialState });

      toast.success("product uploaded successfully");
      navigate("/admin/all-products");
    } catch (error) {
      setisLoading(false);
      toast.error(error.message);
    }
  };

  async function editProduct(e) {
    e.preventDefault();
    // setisLoading(true);
    if (product.imageURL !== productEdit.imageURL) {
      const storageRef = ref(storage, productEdit.imageURL);
      await deleteObject(storageRef);
    }
    // setisLoading(false);

    try {
      await setDoc(doc(db, "products", id), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createdAt: productEdit.createdAt,
        editedAt: Timestamp.now().toDate(),
      });
      // setisLoading(false);
      toast.success("product Edited Successfully");
      navigate("/admin/all-products");
    } catch (error) {
      setisLoading(false);

      toast.error(error.message);
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.product}>
        <h2>{detectForm(id, "Add New Product", "Edit Product")}</h2>

        <Card className={styles.card}>
          <form onSubmit={detectForm(id, addProduct, editProduct)}>
            <label>Product name:</label>
            <input
              type="text"
              placeholder="Product name"
              required
              name="name"
              value={product?.name}
              onChange={(e) => handleInputChange(e)}
            />
            <label>Product Image:</label>
            <Card cardClass={styles.group}>
              {upLoadProgress === 0 ? null : (
                <div className={styles.progress}>
                  {/* <ProgressBar progress={upLoadProgress} /> */}
                  <div
                    className={styles["progress-bar"]}
                    style={{ width: `${upLoadProgress}%` }}
                  >
                    {upLoadProgress < 100
                      ? `Uploading ${upLoadProgress}`
                      : `Upload Complete ${upLoadProgress}%`}
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/"
                placeholder="Product Image"
                name="image"
                onChange={(e) => handleImageChange(e)}
              />
              {product?.imageURL === "" ? null : (
                <input
                  type="text"
                  // required
                  placeholder="image Url"
                  name="imageURL"
                  disabled
                  value={product?.imageURL}
                />
              )}
            </Card>
            <label>Product price:</label>
            <input
              type="number"
              placeholder="Product price"
              required
              name="price"
              value={product?.price}
              onChange={(e) => handleInputChange(e)}
            />

            {/* <label>Product price:</label>
          <input
            type="number"
            placeholder="Product price"
            required
            name="price"
            value={product?.price}
            onChange={(e) => handleInputChange(e)}
          /> */}

            <label>Product category:</label>
            <select
              required
              name="category"
              value={product?.category}
              onChange={(e) => handleInputChange(e)}
            >
              <option value="" disabled>
                -- choose product category
              </option>
              {category.map((cat) => {
                return (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                );
              })}
            </select>
            <label>Product Company/Brand:</label>
            <input
              type="text"
              placeholder="Product brand"
              required
              name="brand"
              value={product?.brand}
              onChange={(e) => handleInputChange(e)}
            />
            <label>Product Description</label>
            <textarea
              name="desc"
              required
              onChange={(e) => handleInputChange(e)}
              value={product?.desc}
              cols="30"
              rows="10"
            ></textarea>
            <button className="--btn --btn-primary">
              {detectForm(id, "Save Product", "Edit Product")}
            </button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddProducts;
