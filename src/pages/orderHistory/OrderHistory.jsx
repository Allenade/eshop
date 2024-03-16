import { useEffect, useState } from "react";
import useFetchCollection from "../../customHooks/useFetchCollection";
import styles from "./OrderHistory.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  STORE_ORDERS,
  selectOrderHistory,
  // selectSelectedPaymentMethod,
} from "../../slice/orderSlice";
import { selectUserID } from "../../slice/authSlice";
import Loader from "../../components/loader/Loader";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const { data, isLoading } = useFetchCollection("orders");
  console.log(data);
  const orders = useSelector(selectOrderHistory);
  const userID = useSelector(selectUserID);
  // const paymentMethod = useSelector(selectSelectedPaymentMethod);
  console.log(orders);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(STORE_ORDERS(data));
  }, [dispatch, data]);

  const handleClick = (id) => {
    navigate(`/order-details/${id}`);
  };
  // const filteredOrders = orders.filter((order) => order.userID === userID);
  const bitcoinOrders = orders.filter(
    (order) => order.userID === userID && order.paymentMethod
  );
  const cardOrders = orders.filter(
    (order) => order.userID === userID && order.paymentMethod
  );

  return (
    <section>
      <div className={`container ${styles.order}`}>
        <h2>Your Order History</h2>
        <p>
          Open an order to leave a <b>Product Review</b>
        </p>
        <br />
        <>
          {isLoading && <Loader />}
          {/* Bitcoin Orders */}
          {bitcoinOrders.length > 0 && (
            <div className={styles.table}>
              <h3>Bitcoin Orders</h3>
              <table>
                <thead>
                  <tr>
                    <th>s/n</th>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Order Amount</th>
                    <th>Order Status</th>
                    <th>Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {bitcoinOrders.map((order, index) => {
                    const {
                      id,
                      orderDate,
                      orderTime,
                      orderAmount,
                      orderStatus,
                      walletAddress,
                    } = order;
                    return (
                      <tr key={id} onClick={() => handleClick(id)}>
                        <td>{index + 1}</td>
                        <td>
                          {orderDate} at {orderTime}
                        </td>
                        <td>{id}</td>
                        <td>
                          {"$"}
                          {orderAmount}
                        </td>
                        <td>
                          <p
                            className={
                              orderStatus !== "Delivered"
                                ? `${styles.pending}`
                                : `${styles.delivered}`
                            }
                          >
                            {orderStatus}
                          </p>
                        </td>
                        <td>Bitcoin</td>
                        <td>
                          <p>Wallet Address: {walletAddress}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {/* card payment */}
          {cardOrders.length > 0 && (
            <div className={styles.table}>
              <h3>Card Orders</h3>
              <table>
                <thead>
                  <tr>
                    <th>s/n</th>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Order Amount</th>
                    <th>Order Status</th>
                    <th>Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {cardOrders.map((order, index) => {
                    const {
                      id,
                      orderDate,
                      orderTime,
                      orderAmount,
                      orderStatus,
                    } = order;
                    return (
                      <tr key={id} onClick={() => handleClick(id)}>
                        <td>{index + 1}</td>
                        <td>
                          {orderDate} at {orderTime}
                        </td>
                        <td>{id}</td>
                        <td>
                          {"$"}
                          {orderAmount}
                        </td>
                        <td>
                          <p
                            className={
                              orderStatus !== "Delivered"
                                ? `${styles.pending}`
                                : `${styles.delivered}`
                            }
                          >
                            {orderStatus}
                          </p>
                        </td>
                        <td>Card</td> {/* Payment method for card orders */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {/* <div className={styles.table}>
            {filteredOrders.length === 0 ? (
              <p>No order found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>s/n</th>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Order Amount</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => {
                    const {
                      id,
                      orderDate,
                      orderTime,
                      orderAmount,
                      orderStatus,
                    } = order;
                    return (
                      <tr key={id} onClick={() => handleClick(id)}>
                        <td>{index + 1}</td>
                        <td>
                          {orderDate} at {orderTime}
                        </td>
                        <td>{id}</td>
                        <td>
                          {"$"}
                          {orderAmount}
                        </td>
                        <td>
                          <p
                            className={
                              orderStatus !== "Delivered"
                                ? `${styles.pending}`
                                : `${styles.delivered}`
                            }
                          >
                            {orderStatus}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div> */}
        </>
      </div>
    </section>
  );
};
export default OrderHistory;
