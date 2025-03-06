import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0e0e0e] text-[#fff] p-6 border-t border-[#fff] mt-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sección de navegación */}
        <div>
          <h3 className="text-lg font-bold mb-4">Navegación</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-[#f90]">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-[#f90]">
                Categorías
              </Link>
            </li>
            <li>
              <Link to="/offers" className="hover:text-[#f90]">
                Ofertas
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-[#f90]">
                Carrito
              </Link>
            </li>
          </ul>
        </div>

        {/* Sección de contacto */}
        <div>
          <h3 className="text-lg font-bold mb-4">Contacto</h3>
          <p>Email: soporte@pcparts.com</p>
          <p>Teléfono: +57 123 456 7890</p>
          <p>Dirección: Calle Ficticia 123, Bogotá, Colombia</p>
        </div>

        {/* Sección de información */}
        <div>
          <h3 className="text-lg font-bold mb-4">Información</h3>
          <p>&copy; {new Date().getFullYear()} PC Parts. Todos los derechos reservados.</p>
          <p>
            <Link to="/terms" className="hover:text-[#f90]">
              Términos y Condiciones
            </Link>
          </p>
          <p>
            <Link to="/privacy" className="hover:text-[#f90]">
              Política de Privacidad
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;