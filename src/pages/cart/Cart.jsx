import { useDispatch, useSelector } from "react-redux";
import styles from "./Cart.module.scss";
import {
  ADD_TO_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  CLEAR_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  SAVE_URL,
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from "../../slice/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import Card from "../../components/card/Card";
import { useEffect } from "react";
import { selectisLoggedIn } from "../../slice/authSlice";

const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectisLoggedIn);
  const navigate = useNavigate();
  console.log(cartTotalAmount);
  console.log(cartTotalQuantity);
  console.log(cartItems);
  const increaseCart = (cart) => {
    dispatch(ADD_TO_CART(cart));
    dispatch(CALCULATE_SUBTOTAL()); // Dispatch after adding to cart
    dispatch(CALCULATE_TOTAL_QUANTITY()); // Dispatch after adding to cart
  };

  const decreaseCart = (cart) => {
    dispatch(DECREASE_CART(cart));
    dispatch(CALCULATE_SUBTOTAL()); // Dispatch after decreasing from cart
    dispatch(CALCULATE_TOTAL_QUANTITY()); // Dispatch after decreasing from cart
  };

  const removeFromCart = (cart) => {
    dispatch(REMOVE_FROM_CART(cart));
    dispatch(CALCULATE_SUBTOTAL()); // Dispatch after removing from cart
    dispatch(CALCULATE_TOTAL_QUANTITY()); // Dispatch after removing from cart
  };

  const clearCart = () => {
    dispatch(CLEAR_CART());
    dispatch(CALCULATE_SUBTOTAL()); // Dispatch after clearing cart
    dispatch(CALCULATE_TOTAL_QUANTITY()); // Dispatch after clearing cart
  };

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_QUANTITY());
    dispatch(SAVE_URL(""));
  }, [dispatch, cartItems]);

  const url = window.location.href;

  const checkout = () => {
    if (isLoggedIn) {
      // Pass cart items and total amount to checkout page
      navigate("/checkout-details", {
        state: { cartItems, cartTotalAmount },
      });
    } else {
      dispatch(SAVE_URL(url));
      navigate("/login");
    }
  };

  return (
    <section>
      <div className={`container ${styles.table}`}>
        <h2>Shopping Cart</h2>
        {cartItems && cartItems.length === 0 ? (
          <>
            <p>Your cart is currently empty.</p>
            <br />
            <Link to="/#products">Continue Shopping</Link>
          </>
        ) : (
          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((cart, index) => {
                const { id, name, totalCost, imageURL, cartQuantity } = cart;
                console.log(totalCost);
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>
                      <p>
                        <b>{name}</b>
                      </p>
                      <img
                        src={imageURL}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{`$${totalCost?.toFixed(2)}`}</td>

                    <td>
                      <div className={styles.count}>
                        <button
                          className="--btn"
                          onClick={() => decreaseCart(cart)}
                        >
                          -
                        </button>
                        <p>
                          <b>{cartQuantity}</b>
                        </p>
                        <button
                          className="--btn"
                          onClick={() => increaseCart(cart)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{`$${(totalCost * cartQuantity)?.toFixed(2)}`}</td>
                    <td className={styles.icon}>
                      <FaTrashAlt
                        size={19}
                        color="red"
                        onClick={() => removeFromCart(cart)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <div className={styles.summary}>
              <button className="--btn --btn-danger" onClick={clearCart}>
                Clear Cart
              </button>
              <div className={styles.checkout}>
                <div>
                  <Link to="/#products">Continue Shopping</Link>
                </div>
                <br />
                <Card className={styles.card}>
                  <p>
                    <b>{`Cart item(s): ${cartTotalQuantity}`}</b>
                  </p>
                  <div className={styles.text}>
                    <h4>Subtotal:</h4>
                    <h3>{`$${cartTotalAmount.toFixed(2)}`}</h3>
                  </div>
                  <p>Tax and shipping calculated at checkout</p>
                  <button
                    className="--btn --btn-primary --btn-block"
                    onClick={checkout}
                  >
                    Checkout
                  </button>
                </Card>
              </div>
            </div>
          </table>
        )}
      </div>
    </section>
  );
};

export default Cart;
