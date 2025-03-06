import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import Slider from 'react-slick';

const Offers = () => {
  const { products, loading, error } = useContext(ProductContext);

  const offerProducts = products.filter((product) => product.discount > 0);

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

  if (loading) {
    return <div className="container mx-auto p-4">Cargando productos...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#fff]">Ofertas</h2>
      {offerProducts.length === 0 ? (
        <p className="text-[#fff]">No hay ofertas disponibles.</p>
      ) : offerProducts.length <= 3 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {offerProducts.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
              <h3 className="text-lg font-semibold mt-2 text-[#fff]">{product.name}</h3>
              <p className="text-[#fff]">
                <span className="line-through">${product.price}</span>{' '}
                <span className="text-green-500">
                  ${(product.price - (product.price * product.discount) / 100).toFixed(2)}
                </span>
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <Slider {...sliderSettings}>
          {offerProducts.map((product) => (
            <div key={product.id} className="px-2">
              <Link
                to={`/product/${product.id}`}
                className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
                <h3 className="text-lg font-semibold mt-2 text-[#fff]">{product.name}</h3>
                <p className="text-[#fff]">
                  <span className="line-through">${product.price}</span>{' '}
                  <span className="text-green-500">
                    ${(product.price - (product.price * product.discount) / 100).toFixed(2)}
                  </span>
                </p>
              </Link>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Offers;