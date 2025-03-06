import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { logAnalyticsEvent } from '../firebase';
import { safeSetStorage, safeGetStorage } from '../utils/storage';
import { useContext } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ProductDetail = ({ products: propProducts }) => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    // Usar los productos pasados como props
    const foundProduct = propProducts.find((p) => p.id === id);
    setProduct(foundProduct);

    if (foundProduct) {
      logAnalyticsEvent('view_item', {
        product_id: foundProduct.id,
        product_name: foundProduct.name,
        price: foundProduct.price,
      });

      const recentlyViewed = safeGetStorage('recentlyViewed', '[]');
      if (!recentlyViewed.includes(id)) {
        recentlyViewed.push(id);
        safeSetStorage('recentlyViewed', recentlyViewed);
      }
    }
  }, [id, propProducts]);

  // Cargar comentarios desde Firestore
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, `products/${id}/comments`);
        const q = query(commentsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const commentsData = querySnapshot.docs.map((doc) => doc.data());
        setComments(commentsData);

        if (commentsData.length > 0) {
          const totalRating = commentsData.reduce((sum, c) => sum + c.rating, 0);
          const avgRating = (totalRating / commentsData.length).toFixed(1);
          setAverageRating(avgRating);
        }
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
      }
    };
    fetchComments();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      const productWithQuantity = { ...product, quantity: 1 };
      addToCart(productWithQuantity);
      logAnalyticsEvent('add_to_cart', {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
      });
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment || rating < 1 || rating > 5) {
      alert('Por favor, escribe un comentario y selecciona una calificación entre 1 y 5.');
      return;
    }

    try {
      const commentsRef = collection(db, `products/${id}/comments`);
      const newComment = {
        text: comment,
        rating: rating,
        timestamp: new Date().toISOString(),
        userId: user.uid,
        userEmail: user.email,
      };
      await addDoc(commentsRef, newComment);

      setComments([newComment, ...comments]);
      setComment('');
      setRating(0);

      const totalRating = [...comments, newComment].reduce((sum, c) => sum + c.rating, 0);
      const avgRating = (totalRating / (comments.length + 1)).toFixed(1);
      setAverageRating(avgRating);
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      alert('Error al enviar el comentario. Intenta de nuevo.');
    }
  };

  if (!product) {
    return <div className="container mx-auto p-4 text-[#fff]">Producto no encontrado.</div>;
  }

  const discountedPrice =
    product.discount > 0
      ? (product.price - (product.price * product.discount) / 100).toFixed(2)
      : null;

  return (
    <div className="container mx-auto p-4 text-[#fff]">
      {/* Encabezado con título y precio */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center mb-2">
          <span className="text-yellow-400">
            {'★'.repeat(Math.round(averageRating)) + '☆'.repeat(5 - Math.round(averageRating))}
          </span>
          <span className="ml-2 text-sm">({averageRating} - {comments.length} reseñas)</span>
        </div>
        <div className="flex items-baseline space-x-2">
          {discountedPrice ? (
            <>
              <p className="text-2xl font-semibold text-green-500">${discountedPrice}</p>
              <p className="text-lg line-through text-gray-400">${product.price}</p>
              <p className="text-sm text-red-500">{product.discount}% OFF</p>
            </>
          ) : (
            <p className="text-2xl font-semibold">${product.price}</p>
          )}
        </div>
        <p className="text-sm text-gray-300 mt-1">Stock disponible: {product.stock}</p>
      </div>

      {/* Sección principal: Imagen y detalles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Imagen del producto */}
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Detalles del producto */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Detalles del Producto</h2>
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">Categoría:</span> {product.category}
            </li>
            <li>
              <span className="font-semibold">Descripción:</span> {product.description}
            </li>
            {product.coupon && (
              <li>
                <span className="font-semibold">Cupón:</span>{' '}
                <span className="text-blue-400">{product.coupon}</span>
              </li>
            )}
            <li>
              <span className="font-semibold">Ventas:</span> {product.sales}
            </li>
          </ul>

          {/* Botones de acción */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-[#f90] text-[#fff] px-6 py-3 rounded-lg hover:bg-[#e68a00] cursor-pointer"
            >
              Agregar al carrito
            </button>
            <button className="bg-blue-500 text-[#fff] px-6 py-3 rounded-lg hover:bg-blue-600 cursor-pointer">
              Comprar ahora
            </button>
          </div>
        </div>
      </div>

      {/* Especificaciones técnicas */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Especificaciones Técnicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-semibold">Marca:</span> {product.brand || 'N/A'}</p>
            <p><span className="font-semibold">Modelo:</span> {product.model || 'N/A'}</p>
            <p><span className="font-semibold">Color:</span> {product.color || 'Negro'}</p>
          </div>
          <div>
            <p><span className="font-semibold">Procesador:</span> {product.processor || 'N/A'}</p>
            <p><span className="font-semibold">Memoria RAM:</span> {product.ram || 'N/A'}</p>
            <p><span className="font-semibold">Almacenamiento:</span> {product.storage || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Sección de comentarios */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Comentarios y Calificaciones</h2>
        {/* Formulario para añadir comentario */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="mb-4">
              <label className="block text-[#fff] mb-2">Calificación:</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[#fff] mb-2">Comentario:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#1a1a1a] text-[#fff] border border-gray-600 focus:outline-none focus:border-[#f90]"
                rows="4"
                placeholder="Escribe tu comentario aquí..."
              />
            </div>
            <button
              type="submit"
              className="bg-[#f90] text-[#fff] px-6 py-2 rounded-lg hover:bg-[#e68a00] cursor-pointer"
            >
              Enviar Comentario
            </button>
          </form>
        ) : (
          <p className="text-[#fff] mb-6">
            Por favor,{' '}
            <Link to="/login" className="text-[#f90] hover:underline">
              inicia sesión
            </Link>{' '}
            para dejar un comentario.
          </p>
        )}

        {/* Lista de comentarios */}
        {comments.length === 0 ? (
          <p className="text-[#fff]">Aún no hay comentarios para este producto.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((c, index) => (
              <div key={index} className="border-t border-gray-600 pt-4">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">
                    {'★'.repeat(c.rating) + '☆'.repeat(5 - c.rating)}
                  </span>
                  <span className="ml-2 text-sm text-gray-400">
                    {new Date(c.timestamp).toLocaleDateString()} - {c.userEmail}
                  </span>
                </div>
                <p className="text-[#fff]">{c.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Productos similares */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Productos Similares</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {propProducts // Usar propProducts en lugar de products
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map((similarProduct) => (
              <Link
                to={`/product/${similarProduct.id}`}
                key={similarProduct.id}
                className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={similarProduct.image}
                  alt={similarProduct.name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="text-lg font-semibold text-[#fff]">{similarProduct.name}</h3>
                <p className="text-[#fff]">
                  {similarProduct.discount > 0 ? (
                    <>
                      <span className="line-through">${similarProduct.price}</span>{' '}
                      <span className="text-green-500">
                        ${(similarProduct.price - (similarProduct.price * similarProduct.discount) / 100).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    `$${similarProduct.price}`
                  )}
                </p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;