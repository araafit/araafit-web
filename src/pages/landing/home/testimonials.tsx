import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./slider-style.css";

/* ---------------------------------------------------- */

export default function Testimonials({
  data,
}: {
  data: Record<string, any>[];
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  const sliderSettings = {
    autoPlay: true,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    pauseOnDotsHover: true,
    afterChange: (idx: number) => setActiveSlide(idx),
    customPaging: (idx: number) => (
      <div className={`custom-dot ${idx === activeSlide ? "active" : ""}`} />
    ),
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider className="w-full h-[236px]" {...sliderSettings}>
      {data.map((item, idx) => (
        <div key={idx} className="w-full max-w-[357px] flex flex-col justify-center gap-4 p-4">
          <p className="text-neutral-950 font-light mb-4">{item.comment}</p>

          <div className="text-primary-500">
            — {item.name},{item.location}
          </div>
        </div>
      ))}
    </Slider>
  );
}
