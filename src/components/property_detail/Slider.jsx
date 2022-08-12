import { useEffect, useState } from "react";
import { BsArrow90DegLeft, BsArrow90DegRight } from "react-icons/bs";
import { RiCloseCircleFill } from "react-icons/ri";
import "./slider.scss";

export default function Slider({ property, setShowSlider }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = property && property.imagesUrl.length;

  const nextSlide = () => {
    //ternary: if we are on the last slide, set current slide to 0 (the beginning), else add one to the current slide
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
  };

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  return (
    <div className="slider popup">
      <p className="close__slider" onClick={()=>setShowSlider(false)}>
        <RiCloseCircleFill />
      </p>
      <div className="property__details__contents">
        <div>
          <BsArrow90DegLeft onClick={prevSlide} className="arrow prev" />
          <BsArrow90DegRight onClick={nextSlide} className="arrow next" />
        </div>

        <div className="images__wrapper">
          {property &&
            property.imagesUrl?.map((image, index) => (
              <div
                key={index}
                className={index === currentSlide ? "slide  current" : "slide"}
              >
                <>
                  {index === currentSlide && (
                    <>
                      {image ? (
                        <img src={image} alt={property?.name} />
                      ) : (
                        <h2>LOADING.......</h2>
                      )}
                    </>
                  )}
                </>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
