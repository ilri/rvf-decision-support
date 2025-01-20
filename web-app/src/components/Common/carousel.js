import React, { useState } from "react";
import { Carousel, CarouselItem, CarouselControl } from "reactstrap";
import classnames from "classnames";

function CarouselComponent({ carouselData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === carouselData.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? carouselData.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  if (!carouselData || carouselData.length === 0) {
    return null;
  }

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous}>
      <ol className="carousel-indicators">
        {carouselData.length !== 0
          ? carouselData?.map((item, index) => {
              return (
                <li
                  key={item.image_url}
                  onClick={() => goToIndex(index)}
                  onKeyDown={() => {}}
                  className={classnames({
                    active: activeIndex === index,
                  })}
                />
              );
            })
          : ""}
      </ol>
      {carouselData.map((item) => (
        <CarouselItem
          onExiting={() => setAnimating(true)}
          onExited={() => setAnimating(false)}
          key={item.title}
        >
          <div className="banner">
            <img
              src={item.image_url}
              alt="text"
              className="carousal-images"
              width="100%"
              height="100%"
            />
            <div className="overlay">
              <p className="carousel-heading">{item.description}</p>
            </div>
          </div>
        </CarouselItem>
      ))}

      <CarouselControl direction="prev" directionText="" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="" onClickHandler={next} />
    </Carousel>
  );
}

export default CarouselComponent;
