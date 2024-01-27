// import styles from "./Admin.module.scss";
import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/admin/navbar/Navbar";
import styles from "./Admin.module.scss";
import Home from "../home/Home";
import ViewProducts from "../../components/admin/viewProducts/ViewProducts";
import AddProducts from "../../components/admin/addProducts/AddProducts";
import Order from "../../components/admin/orders/Order";
const Admin = () => {
  return (
    <div className={styles.admin}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="all-products" element={<ViewProducts />} />
          <Route path="add-product/:id" element={<AddProducts />} />
          <Route path="orders" element={<Order />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
