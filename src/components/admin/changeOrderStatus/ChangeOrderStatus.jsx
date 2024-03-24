/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./ChangeOrderStatus.module.scss";
import Loader from "../../loader/Loader";
import Card from "../../card/Card";
import { Timestamp, doc, setDoc } from "firebase/firestore"; // Check Firestore imports
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase/config";

// eslint-disable-next-line react/prop-types
const ChangeOrderStatus = ({ order, id }) => {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const editOrder = async (e, id) => {
    // Add async keyword
    e.preventDefault();
    setIsLoading(true);

    const orderConfig = {
      userID: order.userID,
      userEmail: order.userEmail,
      orderDate: order.orderDate,
      orderTime: order.orderTime,
      orderAmount: order.orderAmount,
      orderStatus: status,
      cartItems: order.cartItems,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      editedAt: Timestamp.now().toDate(),
    };
    try {
      await setDoc(doc(db, "orders", id), orderConfig); // Await setDoc
      setIsLoading(false);
      toast.success("Order status changed successfully");
      navigate("/admin/orders");
    } catch (error) {
      console.error("Error updating document: ", error);
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className={styles.status}>
        {isLoading && <Loader />}
        <Card cardClass={styles.card}>
          <h4>Update Status</h4>
          <form onSubmit={(e) => editOrder(e, id)}>
            <span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="" disabled>
                  -- Choose one --
                </option>
                <option value="Order Placed...">Order Placed</option>
                <option value="Processing...">Processing...</option>
                <option value="Shipped...">Shipped...</option>
                <option value="Delivered">Delivered</option>
              </select>
            </span>
            <span>
              <button type="submit" className="--btn --btn-primary">
                Update Status
              </button>
            </span>
          </form>
        </Card>
      </div>
    </>
  );
};

export default ChangeOrderStatus;
