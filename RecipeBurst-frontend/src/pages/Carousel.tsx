import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';

const MyCarousel: React.FC = () => {
  return (
    <div style={{ width: '100%' }} className='p-0'>
      <Carousel style={{ maxWidth: '100%', maxHeight: '60vh', overflow: 'hidden' }}>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/assets/images/carousel1.jpg"
          alt="First slide"
          height="1000px"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/assets/images/carousel2.jpg"
          alt="Second slide"
          height="1000px"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/assets/images/carousel3.jpg"
          alt="Third slide"
          height="1000px"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/assets/images/carousel4.jpg"
          alt="Third slide"
          height="1000px"
        />
      </Carousel.Item>
    </Carousel>
    </div>
    
  );
};

export default MyCarousel;
