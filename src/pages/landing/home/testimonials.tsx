import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

/* ---------------------------------------------------- */

export default function Testimonials({
  data,
}: {
  data: Record<string, any>[];
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  const slideToShow = 3;
  const sliderSettings = {
    autoPlay: false,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slideToShow,
    slidesToScroll: 3,
    pauseOnDotsHover: true,
    afterChange: (current: number) => setActiveSlide(() => current / slideToShow),
    customPaging: (idx: number) => ( <div
        className={`custom-dot size-[13px] rounded-full bg-[#F9F9F9] border-2 border-neutral-100 px-[5px] transition-all delay-[0.3s] ease-linear ${
          idx === activeSlide ? "!bg-primary-950 !border-primary-950" : ""
        }`}
      />),
    dotsClass: "slick-dots !flex items-center justify-center pt-[20px]",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
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
        <div
          key={idx}
          className="w-full max-w-[357px] flex flex-col justify-center gap-4 p-4"
        >
          <p className="text-neutral-950 font-light mb-4">{item.comment}</p>

          <div className="text-primary-500">
            — {item.name},{item.location}
          </div>
        </div>
      ))}
    </Slider>
  );
}
