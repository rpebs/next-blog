"use client"

import { useState } from 'react';
import Image from 'next/image';

const Carousel = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index) => {
    setCurrentIndex((index + posts.length) % posts.length);
  };

  const handlePrevClick = (e) => {
    e.preventDefault();
    goToSlide(currentIndex - 1);
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    goToSlide(currentIndex + 1);
  };

  return (
    <div className="carousel w-full rounded-xl">
      {posts.map((post, index) => (
        <div
          id={`slide${index}`}
          className={`carousel-item relative w-full h-96 ${index === currentIndex ? 'block' : 'hidden'}`}
          key={post.id}
          style={{ transition: 'opacity 0.5s ease-in-out' }}
        >
          <Image
            src={post.image}
            className="w-full object-cover"
            alt="image"
            layout="fill"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <button onClick={handlePrevClick} className="btn btn-circle">
              ❮
            </button>
            <button onClick={handleNextClick} className="btn btn-circle">
              ❯
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
