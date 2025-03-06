import { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos desde Firestore al iniciar
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        sales: 0,
        stock: product.stock || 10,
      });
      setProducts((prevProducts) => [...prevProducts, { id: docRef.id, ...product, sales: 0, stock: product.stock || 10 }]);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, updatedProduct);
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product))
      );
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const updateStock = async (id, quantity) => {
    try {
      const product = products.find((p) => p.id === id);
      if (!product) return;

      const newStock = product.stock - quantity;
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, { stock: newStock });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, stock: newStock } : product
        )
      );
    } catch (error) {
      console.error('Error al actualizar stock:', error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, updateStock, loading }}>
      {children}
    </ProductContext.Provider>
  );
};