import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SecondaryMenu from './components/SecondaryMenu';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import PaymentConfirmation from './components/PaymentConfirmation';
import ProductDetail from './components/ProductDetail';
import SearchResults from './components/SearchResults';
import PromoSlider from './components/PromoSlider';
import TopSelling from './components/TopSelling';
import Offers from './components/Offers';
import RecentlyViewed from './components/RecentlyViewed';
import CategoriesPage from './components/CategoriesPage';
import OffersPage from './components/OffersPage';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import { useEffect, useState } from 'react';
import { loadProducts } from './loadProducts';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

function App() {
  const [loadError, setLoadError] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const hasLoaded = localStorage.getItem('productsLoaded');
        if (!hasLoaded) {
          await loadProducts();
          localStorage.setItem('productsLoaded', 'true');
          console.log('Productos cargados iniciales completados (loadProducts).');
        }

        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Productos cargados directamente en App.jsx:', productsData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        setLoadError('Error al cargar los datos iniciales. Revisa la consola para más detalles.');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  if (loadError) {
    return <div className="container mx-auto p-4 text-red-500">{loadError}</div>;
  }

  if (loading) {
    return <div className="container mx-auto p-4">Cargando datos...</div>;
  }

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <SecondaryMenu />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={
                    <>
                      <PromoSlider />
                      <RecentlyViewed />
                      <TopSelling />
                      <Offers />
                      <ProductList />
                    </>
                  } />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
                  <Route path="/product/:id" element={<ProductDetail products={products} />} />
                  <Route path="/categories" element={<CategoriesPage products={products} />} />
                  <Route path="/offers" element={<OffersPage products={products} />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;