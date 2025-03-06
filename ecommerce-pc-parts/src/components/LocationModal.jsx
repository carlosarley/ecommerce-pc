import { useState, useEffect } from 'react';

const LocationModal = ({ onClose, setUserLocation }) => {
  const [location, setLocation] = useState('');

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  const handleSaveLocation = () => {
    localStorage.setItem('userLocation', location);
    setUserLocation(location); // Actualizar el estado en SecondaryMenu
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0e0e0e] p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-[#fff]">Ingresa tu ubicación</h3>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ej: Bogotá, Colombia"
          className="w-full p-2 mb-4 rounded bg-[#fff] text-[#000] focus:outline-none"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-[#fff] px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveLocation}
            className="bg-[#f90] text-[#fff] px-4 py-2 rounded hover:bg-[#e68a00] cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;