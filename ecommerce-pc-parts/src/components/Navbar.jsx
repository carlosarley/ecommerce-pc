import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { normalizeText } from '../utils/normalizeText';
import { logAnalyticsEvent } from '../firebase';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú hamburguesa

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    const normalizedQuery = normalizeText(searchQuery);
    if (normalizedQuery) {
      logAnalyticsEvent('search', { search_term: normalizedQuery });
      navigate(`/search?query=${normalizedQuery}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#0e0e0e] p-4 border-b border-[#fff]">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-[#fff] text-2xl font-bold">
          PC Parts
        </Link>

        {/* Botón hamburguesa (visible en pantallas pequeñas) */}
        <button
          className="md:hidden text-[#fff] focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
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
        <div className={`md:flex items-center space-x-4 ${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 left-0 w-full md:w-auto bg-[#0e0e0e] md:bg-transparent p-4 md:p-0 z-10`}>
          {/* Búsqueda */}
          <form onSubmit={handleSearch} className="flex items-center mb-4 md:mb-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="p-2 rounded-l-md bg-[#fff] text-[#000] focus:outline-none w-full md:w-64"
            />
            <button
              type="submit"
              className="p-2 bg-[#f90] text-[#fff] rounded-r-md hover:bg-[#e68a00] cursor-pointer"
            >
              Buscar
            </button>
          </form>

          {/* Carrito */}
          <Link to="/cart" className="relative text-[#fff] hover:text-[#f90] cursor-pointer block md:inline-block mb-4 md:mb-0">
            <span>Carrito</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#f90] text-[#fff] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Admin */}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="text-[#fff] hover:text-[#f90] cursor-pointer block md:inline-block mb-4 md:mb-0">
              Admin
            </Link>
          )}

          {/* Login/Logout */}
          {user ? (
            <button
              onClick={logout}
              className="text-[#fff] hover:text-[#f90] cursor-pointer block md:inline-block"
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link to="/login" className="text-[#fff] hover:text-[#f90] cursor-pointer block md:inline-block">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;