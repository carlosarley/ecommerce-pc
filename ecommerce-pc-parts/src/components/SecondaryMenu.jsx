import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import LocationModal from './LocationModal';
import axios from 'axios';
import { normalizeText } from '../utils/normalizeText';

const SecondaryMenu = () => {
  const { products } = useContext(ProductContext);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú hamburguesa
  const navigate = useNavigate();

  // Cargar la ubicación desde localStorage al iniciar
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(savedLocation);
    }
  }, []);

  // Obtener la ubicación del usuario usando la API de geolocalización
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Usar Nominatim para geocodificación inversa
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const address = response.data.address;
            const locationString = `${address.city || address.town || address.village || ''}, ${address.country || ''}`;
            setUserLocation(locationString);
            localStorage.setItem('userLocation', locationString);
            setLocationError('');
          } catch (error) {
            console.error('Error al obtener la dirección:', error);
            setLocationError('No se pudo obtener la dirección. Por favor, ingresa tu ubicación manualmente.');
          }
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError('Permiso de ubicación denegado. Por favor, ingresa tu ubicación manualmente.');
          } else {
            setLocationError('Error al obtener la ubicación. Por favor, ingresa tu ubicación manualmente.');
          }
        }
      );
    } else {
      setLocationError('La geolocalización no es compatible con este navegador.');
    }
  };

  const handleCategoriesClick = () => {
    setIsMenuOpen(false); // Cerrar el menú al hacer clic
    navigate('/categories');
  };

  const handleOffersClick = () => {
    setIsMenuOpen(false); // Cerrar el menú al hacer clic
    navigate('/offers');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-[#0e0e0e] p-2 border-t border-[#fff]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Ubicación */}
        <div className="relative flex items-center space-x-2">
          {/* Mostrar el botón "Obtener Ubicación" solo si no hay ubicación */}
          {!userLocation && (
            <button
              onClick={handleGetLocation}
              className="text-[#fff] hover:text-[#f90] cursor-pointer"
            >
              Obtener Ubicación
            </button>
          )}
          <button
            onClick={() => setShowLocationModal(true)}
            className="text-[#fff] hover:text-[#f90] cursor-pointer"
          >
            {userLocation ? `Ubicación: ${userLocation}` : 'Agregar Ubicación'}
          </button>
          {locationError && (
            <p className="text-red-500 text-sm">{locationError}</p>
          )}
        </div>

        {/* Botón hamburguesa (visible en pantallas pequeñas) */}
        <button
          className="md:hidden text-[#fff] focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle secondary menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        {/* Menú (visible en pantallas grandes, oculto en pequeñas) */}
        <div className={`md:flex space-x-6 ${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 right-0 w-48 md:w-auto bg-[#0e0e0e] md:bg-transparent p-4 md:p-0 z-10`}>
          <button
            onClick={handleCategoriesClick}
            className="text-[#fff] hover:text-[#f90] cursor-pointer block md:inline-block mb-4 md:mb-0"
          >
            Categorías
          </button>
          <button
            onClick={handleOffersClick}
            className="text-[#fff] hover:text-[#f90] cursor-pointer block md:inline-block"
          >
            Ofertas
          </button>
        </div>
      </div>

      {showLocationModal && (
        <LocationModal
          onClose={() => setShowLocationModal(false)}
          setUserLocation={setUserLocation}
        />
      )}
    </div>
  );
};

export default SecondaryMenu;