import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_QUANTITY,
  selectCartItems,
  selectCartTotalAmount,
} from "../../slice/cartSlice";
import { selectEmail } from "../../slice/authSlice";
import {
  selectBillingAddress,
  selectShippingAddress,
} from "../../slice/checkoutSlice";
import { toast } from "react-toastify";
import CheckoutFom from "../../components/checkoutForm/CheckoutFom";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PRIVATE_KEY);
const stripePromise = loadStripe(
  "pk_test_51OkF0JJvivbgKHtpGiltr542a1MNisGxSEfMIcHzXVxvi8jQ5YZIiJsu6aQl63zo7AGlVWBAUFfCAJOAZWtE5Qw900rbbjgmCK"
);

const Checkout = () => {
  const [message, setMessage] = useState("initializing checkout...");
  const [clientSecret, setClientSecret] = useState("");
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmount);
  const customerEmail = useSelector(selectEmail);

  const shippingAddress = useSelector(selectShippingAddress);
  const billingAddress = useSelector(selectBillingAddress);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, [dispatch, cartItems]);

  const description = `eShop payment: email: ${customerEmail}, Amount: ${totalAmount}`;

  useEffect(() => {
    // http://localhost:4242/create-payment-intent
    // Create PaymentIntent as soon as the page loads
    fetch(
      "https://reactbackend-ccju.onrender.com/stripe/create-checkout-session",
      // "http://localhost:4242/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          userEmail: customerEmail,
          shipping: shippingAddress,
          totalPrice: totalAmount,
          billing: billingAddress,
          description,
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          console.log(res);
          return res.json();
        }
        return res.json().then((json) => Promise.reject(json));
      })
      .then((data) => {
        console.log(data);
        // setClientSecret(data.clientSecret);
        setClientSecret(data.client_secret);
      })
      .catch((error) => {
        setMessage("Failed to initialize checkout");
        toast.error("Something went wrong!!!");
        console.log(error, "error bit");
      });
    console.log(shippingAddress, billingAddress, customerEmail, cartItems);
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };
  return (
    <>
      <section>
        <div className="container">{!clientSecret && <h3>{message}</h3>}</div>
      </section>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutFom />
        </Elements>
      )}
    </>
  );
};

export default Checkout;
