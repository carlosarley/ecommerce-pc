import { useLocation, Link } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const { filteredProducts = [], searchTerm = '' } = location.state || {};

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#fff]">
        Resultados de búsqueda para "{searchTerm}"
      </h2>
      {filteredProducts.length === 0 ? (
        <p className="text-[#fff]">No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                <h2 className="text-lg font-semibold mt-2 text-[#fff]">{product.name}</h2>
                <p className="text-[#fff]">{product.description}</p>
                <p className="text-[#fff]">
                  ${product.discount > 0 ? (
                    <>
                      <span className="line-through">${product.price}</span>{' '}
                      <span className="text-green-500">
                        ${(product.price - (product.price * product.discount) / 100).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    product.price
                  )}
                  {product.coupon && <span className="text-blue-500 ml-2">Cupón: {product.coupon}</span>}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;