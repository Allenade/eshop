import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
import { sliderData } from "./slider-data";
import { useEffect, useState } from "react";
import "./slider.scss";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderLength = sliderData.length;
  //   console.log(sliderLength);

  const autoScroll = true;

  let intervalTime = 5000;
  let slideInterval;

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderData.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + sliderData.length) % sliderData.length
    );
  };
  useEffect(() => {
    setCurrentSlide(0);
  }, []);
  function auto() {
    slideInterval = setInterval(goToNextSlide, intervalTime);
  }
  useEffect(() => {
    if (autoScroll) {
      auto();
    }
    return () => clearInterval(slideInterval);
  }, [currentSlide]);
  return (
    <div className="slider">
      <FaRegArrowAltCircleLeft className="arrow prev" onClick={goToPrevSlide} />

      <FaRegArrowAltCircleRight
        className="arrow next"
        onClick={goToNextSlide}
      />

      {sliderData.map((slide, index) => (
        <div
          key={index}
          className={index === currentSlide ? "slide current" : "slide"}
        >
          {index === currentSlide && (
            <>
              <img src={slide.image} alt="slide" />
              <div className="content">
                <h2>{slide.heading}</h2>
                <p>{slide.desc}</p>
                <hr />
                <a href="#product" className="--btn --btn-primary">
                  Shop Now
                </a>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Slider;
