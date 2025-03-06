import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { logAnalyticsEvent } from '../firebase';
import axios from 'axios';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const [status, setStatus] = useState('pending');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const transactionId = params.get('id'); // Wompi envía el ID de la transacción en la URL

    if (transactionId) {
      setTransactionId(transactionId);
      checkTransactionStatus(transactionId);
    }
  }, [location]);

  const checkTransactionStatus = async (transactionId) => {
    try {
      const response = await axios.get(`https://sandbox.wompi.co/v1/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_WOMPI_PUBLIC_KEY}`,
        },
      });

      const transaction = response.data.data;
      setStatus(transaction.status.toLowerCase());

      if (transaction.status === 'APPROVED') {
        // Registrar evento de compra completada
        const total = cart.reduce((total, item) => total + item.price, 0);
        logAnalyticsEvent('purchase', {
          transaction_id: transactionId,
          value: total,
          currency: 'COP',
          items: cart.map((item) => ({
            item_id: item.id,
            item_name: item.name,
            price: item.price,
          })),
        });

        // Limpiar el carrito
        setCart([]);
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Confirmación de Pago</h2>
      {status === 'pending' && <p className="text-gray-600">Verificando el estado del pago...</p>}
      {status === 'approved' && (
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-700">¡Pago aprobado! Gracias por tu compra.</p>
          <p>Transacción ID: {transactionId}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Volver a la tienda
          </button>
        </div>
      )}
      {status === 'declined' && (
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-700">El pago fue rechazado. Intenta de nuevo.</p>
          <button
            onClick={() => navigate('/cart')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Volver al carrito
          </button>
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-700">Error al verificar el pago. Por favor, contacta al soporte.</p>
          <button
            onClick={() => navigate('/cart')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Volver al carrito
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmation;