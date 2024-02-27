import { Link } from "react-router-dom";

const CheckoutSuccess = () => {
  return (
    <section>
      <div className="container">
        <h1>Checkout Success</h1>
        <p>Thank you for purchase</p>
        <br />
        <button className="--btn --btn-primary">
          <Link to="/order-history">View Order status</Link>
        </button>
      </div>
    </section>
  );
};

export default CheckoutSuccess;
