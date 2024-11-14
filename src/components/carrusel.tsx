"use client";

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

const Slider = dynamic(() => import("react-slick"), { ssr: false });
const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), { ssr: false });

const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
};

// Array de imágenes generadas automáticamente
const images = Array.from({ length: 20 }, (_, index) => 
  require(`../../src/images/imagen_${index + 1 < 10 ? `0${index + 1}` : index + 1}.jpg`)
);

const Carousel: React.FC = () => {
  const sliderRef = useRef(null);

  const nextSlide = () => {
    sliderRef.current?.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '500px',
      width: '600px',
      backgroundColor: '#f0f0f0',
      borderRadius: '12px',
      overflow: 'hidden',
      margin: '0 auto',
    }}>
      {/* Botón de retroceso */}
<button 
  onClick={prevSlide} 
  style={{
    position: 'absolute',
    left: '10px',
    background: 'rgba(0, 0, 0, 0.5)', // Fondo negro transparente
    color: '#ffffff', // Color blanco para el icono
    border: '2px solid black', // Borde negro
    borderRadius: '50%',
    padding: '0.5rem',
    cursor: 'pointer',
    zIndex: 1,
  }}
>
  <FontAwesomeIcon icon={faAnglesLeft} />
</button>

      <Slider ref={sliderRef} {...carouselSettings} style={{ height: '100%', width: '100%' }}>
        {images.map((imgSrc, index) => (
          <div key={index} style={{ height: '100%', position: 'relative' }}>
            <Image 
              src={imgSrc.default} 
              alt={`Imagen ${index + 1}`} 
              width={600} 
              height={300} 
              style={{ borderRadius: '12px' }}
            />
          </div>
        ))}
      </Slider>

      {/* Botón de avance */}
<button 
  onClick={nextSlide} 
  style={{
    position: 'absolute',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.5)', // Fondo negro transparente
    color: '#ffffff', // Color blanco para el icono
    border: '2px solid black', // Borde negro
    borderRadius: '50%',
    padding: '0.5rem',
    cursor: 'pointer',
    zIndex: 1,
  }}
>
  <FontAwesomeIcon icon={faAnglesRight} />
</button>
    </div>
  );
};

export default Carousel;
