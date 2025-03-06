import Slider from 'react-slick';

const PromoSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const promos = [
    {
      image: 'https://picsum.photos/1200/400?random=1', // Reemplazar
      alt: 'Promo 1',
    },
    {
      image: 'https://picsum.photos/1200/400?random=2', // Reemplazar
      alt: 'Promo 2',
    },
    {
      image: 'https://picsum.photos/1200/400?random=3', // Reemplazar
      alt: 'Promo 3',
    },
  ];

  return (
    <div className="w-full">
      <Slider {...settings}>
        {promos.map((promo, index) => (
          <div key={index}>
            <img src={promo.image} alt={promo.alt} className="w-full h-64 object-cover" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PromoSlider;