import { useState, useEffect, useContext } from 'react'; // Añadir useContext
import { Link } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { safeGetStorage } from '../utils/storage';
import Slider from 'react-slick';

const RecentlyViewed = () => {
  const { products } = useContext(ProductContext);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const viewed = safeGetStorage('recentlyViewed', '[]');
    const viewedProducts = products.filter((product) => viewed.includes(product.id));
    setRecentlyViewed(viewedProducts);
  }, [products]);

  // Configuración del slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#fff]">Visto Recientemente</h2>
      {recentlyViewed.length <= 3 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recentlyViewed.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
              <h3 className="text-lg font-semibold mt-2 text-[#fff]">{product.name}</h3>
              <p className="text-[#fff]">${product.price}</p>
            </Link>
          ))}
        </div>
      ) : (
        <Slider {...sliderSettings}>
          {recentlyViewed.map((product) => (
            <div key={product.id} className="px-2">
              <Link
                to={`/product/${product.id}`}
                className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
                <h3 className="text-lg font-semibold mt-2 text-[#fff]">{product.name}</h3>
                <p className="text-[#fff]">${product.price}</p>
              </Link>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default RecentlyViewed;