import React from "react";
import { Carousel } from "antd";

const contentStyle = {
  margin: 0,
  height: "300px",
  lineHeight: "300px",
  textAlign: "center",
  background: "#364d79",
  width: "100%",
  objectFit: "cover",
};

const CustomCarousel = () => (
  <Carousel
    autoplay={{
      dotDuration: true,
    }}
    autoplaySpeed={3000}
  >
    <div>
      <img
        src="https://res.cloudinary.com/ddvgzy4xh/image/upload/v1742196031/online-library_qtznxa.png"
        alt="Slide 1"
        style={contentStyle}
      />
    </div>
    <div>
      <img
        src="https://res.cloudinary.com/ddvgzy4xh/image/upload/v1742196031/programming-book_mjdy0y.png"
        alt="Slide 2"
        style={contentStyle}
      />
    </div>
    <div>
      <img
        src="https://res.cloudinary.com/ddvgzy4xh/image/upload/v1742196031/allbook_ibuhso.jpg"
        alt="Slide 3"
        style={contentStyle}
      />
    </div>
    <div>
      <img
        src="https://res.cloudinary.com/ddvgzy4xh/image/upload/v1742196031/trending-book_nc33sf.webp"
        alt="Slide 4"
        style={contentStyle}
      />
    </div>
  </Carousel>
);

export default CustomCarousel;
