import { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ProductContext } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import { logAnalyticsEvent } from '../firebase';

const ProductList = () => {
  const { addToCart } = useContext(CartContext);
  const { products, loading, error } = useContext(ProductContext);
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const filteredProducts = selectedCategory === 'Todas'
    ? products
    : products.filter((product) => product.category === selectedCategory);

  const categories = ['Todas', ...new Set(products.map((product) => product.category))];

  const handleAddToCart = (product) => {
    const productWithQuantity = { ...product, quantity: 1 };
    addToCart(productWithQuantity);
    logAnalyticsEvent('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
    });
  };

  if (loading) {
    return <div className="container mx-auto p-4">Cargando productos...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#fff]">Productos</h2>
      <div className="mb-4">
        <label className="block text-[#fff]">Filtrar por Categoría</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-1/4 p-2 border rounded"
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <p className="text-[#fff]">No se encontraron productos.</p>
        ) : (
          filteredProducts.map((product) => (
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
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-2 bg-[#f90] text-[#fff] px-4 py-2 rounded hover:bg-[#e68a00] cursor-pointer"
              >
                Añadir al carrito
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;