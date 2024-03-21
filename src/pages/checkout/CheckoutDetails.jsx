import { useEffect, useState } from "react";
import styles from "./CheckoutDetails.module.scss";
import Card from "../../components/card/Card";
import { CountryDropdown } from "react-country-region-selector";
import { useDispatch, useSelector } from "react-redux";
// import bitcoinStyles from "./BitcoinPopup.module.scss";
import {
  SAVE_BILLING_ADDRESS,
  SAVE_SHIPPING_ADDRESS,
} from "../../slice/checkoutSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSummary from "../../components/checkoutSummary/CheckoutSummary";
import { selectEmail, selectUserID } from "../../slice/authSlice";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-toastify";
import {
  CLEAR_CART,
  selectCartItems,
  selectCartTotalAmount,
} from "../../slice/cartSlice";
const initialAddressState = {
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  phone: "",
};
const CheckoutDetails = () => {
  const [shippingAddress, setShippingAddress] = useState({
    ...initialAddressState,
  });
  const [billingAddress, setBillingAddress] = useState({
    ...initialAddressState,
  });

  // payment option
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const userEmail = useSelector(selectEmail);
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const userID = useSelector(selectUserID);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleShipping = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleBilling = (e) => {
    const { name, value } = e.target;

    setBillingAddress({ ...billingAddress, [name]: value });
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   dispatch(SAVE_SHIPPING_ADDRESS(shippingAddress));
  //   dispatch(SAVE_BILLING_ADDRESS(billingAddress));
  //   navigate("/checkout");
  // };
  // payment method

  // bitcoin ? function

  const registerBitcoinOrder = async () => {
    // Access data from store using useSelector
    const today = new Date();
    const date = today.toDateString();
    const time = today.toLocaleTimeString();
    const orderConfig = {
      userEmail,
      userID,
      orderDate: date,
      orderTime: time,
      orderAmount: cartTotalAmount,
      orderStatus: "Order Placed",
      paymentMethod: "Bitcoin", // Added payment method
      // walletAddress: "bc1qf95sythpec9j28y748jzg5pc9ze4tp8m089gsf",
      cartItems,
      shippingAddress,
      // createAt: Timestamp.now().toDate(),
    };
    try {
      await addDoc(collection(db, "orders"), orderConfig);
      toast.success("Order Saved");
      dispatch(CLEAR_CART(cartItems));
      navigate("/checkout-success");
      // Redirect to success page after saving order
      // window.location.href = "http://localhost:5173/checkout-success";
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to save order");
    }
  };

  // const showBitcoinWalletAddress = () => {
  //   const walletAddress = "your_bitcoin_wallet_address"; // Replace with your actual address
  //   alert(`Please send your Bitcoin payment to: ${walletAddress}`);
  // };

  // const showBitcoinWalletAddress = () => {
  //   const walletAddress = "bc1qf95sythpec9j28y748jzg5pc9ze4tp8m089gsf"; // Replace with your actual address

  //   // Show alert with wallet address
  //   alert(`Please send your Bitcoin payment to: ${walletAddress}`);

  //   // Function to copy wallet address to clipboard
  //   const copyToClipboard = (text) => {
  //     navigator.clipboard.writeText(text).then(
  //       () => {
  //         alert("Bitcoin wallet address copied to clipboard!\nCopied");
  //       },
  //       () => {
  //         alert("Failed to copy address!");
  //       }
  //     );
  //   };
const showBitcoinWalletAddress = async () => {
  try {
    const walletAddress = "bc1qf95sythpec9j28y748jzg5pc9ze4tp8m089gsf";
    alert(`Please send your Bitcoin payment to: ${walletAddress}`);
    await navigator.clipboard.writeText(walletAddress);
    alert("Bitcoin wallet address copied to clipboard!");
  } catch (error) {
    console.error("Error copying address:", error);
    alert("Failed to copy address! Please copy manually.");
  }
};
    // Copy wallet address when the alert is closed
    setTimeout(() => {
      copyToClipboard(walletAddress);
    }, 1000); // Adjust the delay as needed
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    if (method === "bitcoin") {
      registerBitcoinOrder();
      showBitcoinWalletAddress();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(SAVE_SHIPPING_ADDRESS(shippingAddress));
    dispatch(SAVE_BILLING_ADDRESS(billingAddress));
    setShowPaymentOptions(true); // Show payment options after saving addresses
  };
  useEffect(() => {
    if (selectedPaymentMethod) {
      // Redirect to payment page based on selected method
      if (selectedPaymentMethod === "card") {
        navigate("/checkout");
      } else if (selectedPaymentMethod === "bitcoin") {
        navigate("/order-history");
      }
    }
  }, [selectedPaymentMethod]);

  // end of payment method
  return (
    <section>
      <div className={`container ${styles.checkout}`}>
        <h2>Checkout Details</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <Card cardClass={styles.card}>
              <h3>shipping Address</h3>
              <label>Recipent Name</label>
              <input
                type="text"
                placeholder="Recipient Name"
                required
                name="name"
                value={shippingAddress.name}
                onChange={(e) => handleShipping(e)}
              />
              <label>Address line 1</label>
              <input
                type="text"
                placeholder="Address line 1"
                required
                name="line1"
                value={shippingAddress.line1}
                onChange={(e) => handleShipping(e)}
              />
              <label>Address line 2</label>
              <input
                type="text"
                placeholder="Address line 2"
                name="line2"
                value={shippingAddress.line2}
                onChange={(e) => handleShipping(e)}
              />
              <label>City</label>
              <input
                type="text"
                placeholder="City"
                required
                name="city"
                value={shippingAddress.city}
                onChange={(e) => handleShipping(e)}
              />
              <label>State</label>
              <input
                type="text"
                placeholder="state"
                required
                name="state"
                value={shippingAddress.state}
                onChange={(e) => handleShipping(e)}
              />
              <label>Postal_code</label>
              <input
                type="text"
                placeholder="Postal code"
                required
                name="postal_code"
                value={shippingAddress.postal_code}
                onChange={(e) => handleShipping(e)}
              />
              {/* Country input */}
              <CountryDropdown
                valueType="short"
                className={styles.select}
                value={shippingAddress.country}
                onChange={(val) =>
                  handleShipping({
                    target: {
                      name: "country",
                      value: val,
                    },
                  })
                }
              />
              <label>Phone</label>
              <input
                type="text"
                placeholder="Phone"
                required
                name="phone"
                value={shippingAddress.phone}
                onChange={(e) => handleShipping(e)}
              />
            </Card>
            {/* Billing address */}
            <Card cardClass={styles.card}>
              <h3>Billing Address</h3>
              <label>Recipent Name</label>
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={billingAddress.name}
                onChange={(e) => handleBilling(e)}
              />
              <label>Address line 1</label>
              <input
                type="text"
                placeholder="Address line 1"
                required
                name="line1"
                value={billingAddress.line1}
                onChange={(e) => handleBilling(e)}
              />
              <label>Address line 2</label>
              <input
                type="text"
                placeholder="Address line 2"
                name="line2"
                value={billingAddress.line2}
                onChange={(e) => handleBilling(e)}
              />
              <label>City</label>
              <input
                type="text"
                placeholder="City"
                required
                name="city"
                value={billingAddress.city}
                onChange={(e) => handleBilling(e)}
              />
              <label>State</label>
              <input
                type="text"
                placeholder="state"
                required
                name="state"
                value={billingAddress.state}
                onChange={(e) => handleBilling(e)}
              />
              <label>Postal_code</label>
              <input
                type="text"
                placeholder="Postal code"
                required
                name="postal_code"
                value={billingAddress.postal_code}
                onChange={(e) => handleBilling(e)}
              />
              {/* Country input */}
              <CountryDropdown
                valueType="short"
                className={styles.select}
                value={billingAddress.country}
                onChange={(val) =>
                  handleBilling({
                    target: {
                      name: "country",
                      value: val,
                    },
                  })
                }
              />
              <label>Phone</label>
              <input
                type="text"
                placeholder="Phone"
                required
                name="phone"
                value={shippingAddress.phone}
                onChange={(e) => handleShipping(e)}
              />
              {/* <button type="submit" className="--btn --btn-primary ">
                Proceed To Checkout
              </button> */}
              {showPaymentOptions && (
                <div className={styles.paymentOptions}>
                  <h3>Select Payment Method</h3>
                  <button
                    className={`${styles.paymentButton} --btn --btn-primary`}
                    onClick={() => handlePaymentMethodSelect("card")}
                  >
                    Pay with Card
                  </button>
                  <button
                    className={`${styles.paymentButton} --btn --btn-danger`}
                    onClick={() => handlePaymentMethodSelect("bitcoin")}
                  >
                    Pay with Bitcoin
                  </button>
                  {/* <div className={styles.paymentInfo}>
                    <p>
                      For Cash App payments, please use the link below to access
                      detailed instructions:
                      <a href="YOUR_CASH_APP_LINK_HERE" target="_blank">
                        Cash App Payment Instructions
                      </a>
                    </p>
                  </div>
                  <div className={styles.videoContainer}>
                    <iframe
                      width="560"
                      height="315"
                      src="https://www.youtube.com/embed/fZbW8C5T_9g?rel=0"
                      title="YouTube video player"
                      // frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div> */}
                </div>
              )}
              <button type="submit" className="--btn --btn-primary">
                Proceed To Checkout
              </button>
            </Card>
          </div>
          <div>
            <Card cardClass={styles.card}>
              <CheckoutSummary />
            </Card>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutDetails;
