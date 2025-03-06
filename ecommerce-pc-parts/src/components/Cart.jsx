import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { ProductContext } from '../context/ProductContext';
import { logAnalyticsEvent } from '../firebase';
import axios from 'axios';

const Cart = () => {
  const { cart, setCart, removeFromCart, updateQuantity } = useContext(CartContext);
  const { products, updateStock } = useContext(ProductContext);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Calcular el total sin descuento
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  // Calcular el total con descuento
  const total = subtotal - (subtotal * discount) / 100;

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/banks');
        console.log('Bancos recibidos:', response.data.data);
        setBanks(response.data.data || []);
      } catch (err) {
        setError('Error al cargar los bancos. Intenta de nuevo.');
        console.error('Error al obtener bancos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, []);

  const handleQuantityChange = async (productId, currentQuantity, change) => {
    const productInCart = cart.find((item) => item.id === productId);
    const productInFirestore = products.find((p) => p.id === productId);

    console.log('Producto en carrito:', productInCart);
    console.log('Producto en Firestore:', productInFirestore);

    if (!productInCart || !productInFirestore) {
      setError('Producto no encontrado.');
      return;
    }

    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      setError('La cantidad mínima es 1. Usa "Eliminar" para quitar el producto.');
      return;
    }

    // Verificar el stock disponible
    const availableStock = productInFirestore.stock + currentQuantity;
    console.log(`Stock disponible para ${productInCart.name}: ${availableStock}`);
    if (newQuantity > availableStock) {
      setError(`Solo hay ${productInFirestore.stock} unidades disponibles de ${productInCart.name}.`);
      return;
    }

    // Calcular la diferencia de cantidad para ajustar el stock
    const quantityDifference = newQuantity - currentQuantity;
    console.log(`Cambiando cantidad de ${currentQuantity} a ${newQuantity} (Diferencia: ${quantityDifference})`);

    try {
      // Actualizar el stock en Firestore
      await updateStock(productId, quantityDifference);
      // Actualizar la cantidad en el carrito
      updateQuantity(productId, newQuantity);
      setError('');
    } catch (err) {
      console.error('Error al actualizar la cantidad:', err);
      setError(err.message || 'Error al actualizar la cantidad. Verifica los permisos de Firestore.');
    }
  };

  const handleApplyCoupon = () => {
    const productWithCoupon = products.find((product) => product.coupon === couponCode);
    if (productWithCoupon) {
      setDiscount(productWithCoupon.discount);
      setError('');
    } else {
      setDiscount(0);
      setError('Cupón inválido.');
    }
  };

  const handlePayment = async () => {
    if (!selectedBank) {
      setError('Por favor, selecciona un banco.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/create-transaction', {
        amountInCents: total * 100,
        customerEmail: 'cliente@example.com',
        redirectUrl: 'http://localhost:5173/payment-confirmation',
        financialInstitutionCode: selectedBank,
      });

      const transaction = response.data.data;
      if (transaction.payment_method && transaction.payment_method.payment_url) {
        logAnalyticsEvent('begin_checkout', {
          value: total,
          currency: 'COP',
          items: cart.map((item) => ({
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        });

        window.location.href = transaction.payment_method.payment_url;
      } else {
        setError('No se pudo generar la URL de pago. Intenta de nuevo.');
      }
    } catch (err) {
      setError('Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#fff]">Tu Carrito</h2>
      {cart.length === 0 ? (
        <p className="text-[#fff]">El carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="flex items-center border p-4 rounded-lg shadow-lg">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#fff]">{item.name}</h3>
                <p className="text-[#fff]">${item.price} x {item.quantity}</p>
                <p className="text-[#fff] font-semibold">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                    className="bg-gray-300 text-black px-3 py-1 rounded-l hover:bg-gray-400 cursor-pointer"
                  >
                    +
                  </button>
                  <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                  {item.quantity > 1 && (
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                      className="bg-gray-300 text-black px-3 py-1 rounded-r hover:bg-gray-400 cursor-pointer"
                    >
                      −
                    </button>
                  )}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-[#fff] px-4 py-1 rounded hover:bg-red-600 cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <p className="text-xl font-semibold text-[#fff]">Subtotal: ${subtotal.toFixed(2)}</p>
            <div className="my-4">
              <label className="block text-[#fff]">Código de cupón</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ingresa tu cupón"
                  className="p-2 rounded-l-md bg-[#fff] text-[#000] focus:outline-none"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="p-2 bg-[#f90] text-[#fff] rounded-r-md hover:bg-[#e68a00] cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
              {discount > 0 && (
                <p className="text-green-500 mt-2">Descuento aplicado: {discount}%</p>
              )}
            </div>
            <p className="text-xl font-semibold text-[#fff]">Total: ${total.toFixed(2)}</p>
            <div className="mt-4">
              <label className="block text-[#fff]">Selecciona tu banco</label>
              {loading ? (
                <p className="text-[#fff]">Cargando bancos...</p>
              ) : (
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={banks.length === 0}
                >
                  <option value="">Selecciona un banco</option>
                  {banks.map((bank) => (
                    <option key={bank.financial_institution_code} value={bank.financial_institution_code}>
                      {bank.financial_institution_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
              onClick={handlePayment}
              disabled={loading || banks.length === 0}
              className={`mt-4 bg-[#f90] text-[#fff] px-4 py-2 rounded hover:bg-[#e68a00] cursor-pointer ${loading || banks.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Procesando...' : 'Pagar con PSE'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;