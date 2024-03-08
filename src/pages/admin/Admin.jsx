// import styles from "./Admin.module.scss";
import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/admin/navbar/Navbar";
import styles from "./Admin.module.scss";

import ViewProducts from "../../components/admin/viewProducts/ViewProducts";
import AddProducts from "../../components/admin/addProducts/AddProducts";
import Order from "../../components/admin/orders/Order";
import Home from "../../components/admin/home/Home";
import OrderDetails from "../../components/admin/orderDetails/OrderDetails";
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
          <Route path="order-details/:id" element={<OrderDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
