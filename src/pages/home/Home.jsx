import Slider from "../../components/slider/slider";

import { Product } from "../../components/product/Product";
import { useEffect } from "react";

// import AdminRoute from "../../components/adminRoute/AdminRoute";

const Home = () => {
  const url = window.location.href;
  // alert(url);

  useEffect(() => {
    function scrollProducts() {
      if (url.includes("#product"))
        window.scrollTo({
          top: 700,
          behavior: "smooth",
        });
      return;
    }
    scrollProducts();
  }, [url]);
  return (
    <div>
      <Slider />
      <Product />
    </div>
  );
};

export default Home;
