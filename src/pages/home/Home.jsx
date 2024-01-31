// import Slider from "../../components/slider/slider";

import { Product } from "../../components/product/Product";
// import { useEffect } from "react";

// import AdminRoute from "../../components/adminRoute/AdminRoute";

const Home = () => {
  const url = window.location.href;
  // alert(url);

  function scrollProducts() {
    if (url.includes("#product"))
      window.scrollTo({
        top: 700,
        behavior: "smooth",
      });
    return;
  }
  // useEffect(() => {
  //   scrollProducts();
  // }, []);
  return (
    <div>
      {/* <Slider /> */}
      <Product />
    </div>
  );
};

export default Home;
