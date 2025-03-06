import { db } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'; // Añadir 'doc'

const productsToLoad = [
  { name: 'Procesador AMD Ryzen 5', description: 'Procesador de 6 núcleos', price: 200, image: 'https://via.placeholder.com/150?text=Ryzen+5', discount: 0, coupon: '', sales: 50, category: 'Procesadores', stock: 10 },
  { name: 'Procesador Intel Core i7', description: 'Procesador de 8 núcleos', price: 350, image: 'https://via.placeholder.com/150?text=Core+i7', discount: 5, coupon: 'INTEL5', sales: 40, category: 'Procesadores', stock: 8 },
  { name: 'Procesador AMD Ryzen 7', description: 'Procesador de 8 núcleos', price: 300, image: 'https://via.placeholder.com/150?text=Ryzen+7', discount: 10, coupon: 'RYZEN10', sales: 35, category: 'Procesadores', stock: 15 },
  { name: 'Tarjeta gráfica RTX 3060', description: 'GPU de alto rendimiento', price: 400, image: 'https://via.placeholder.com/150?text=RTX+3060', discount: 10, coupon: 'SAVE10', sales: 30, category: 'Tarjetas Gráficas', stock: 5 },
  { name: 'Tarjeta gráfica GTX 1660', description: 'GPU para gaming', price: 250, image: 'https://via.placeholder.com/150?text=GTX+1660', discount: 0, coupon: '', sales: 25, category: 'Tarjetas Gráficas', stock: 12 },
  { name: 'Tarjeta gráfica RX 6700 XT', description: 'GPU AMD de alto rendimiento', price: 450, image: 'https://via.placeholder.com/150?text=RX+6700+XT', discount: 15, coupon: 'AMD15', sales: 20, category: 'Tarjetas Gráficas', stock: 7 },
  { name: 'Memoria RAM 16GB', description: 'Memoria DDR4 3200MHz', price: 80, image: 'https://via.placeholder.com/150?text=RAM+16GB', discount: 0, coupon: '', sales: 20, category: 'Memorias RAM', stock: 20 },
  { name: 'Memoria RAM 32GB', description: 'Memoria DDR4 3600MHz', price: 150, image: 'https://via.placeholder.com/150?text=RAM+32GB', discount: 5, coupon: 'RAM5', sales: 15, category: 'Memorias RAM', stock: 10 },
  { name: 'Memoria RAM 8GB', description: 'Memoria DDR4 3000MHz', price: 50, image: 'https://via.placeholder.com/150?text=RAM+8GB', discount: 0, coupon: '', sales: 10, category: 'Memorias RAM', stock: 25 },
  { name: 'SSD 1TB NVMe', description: 'Disco sólido de alta velocidad', price: 120, image: 'https://via.placeholder.com/150?text=SSD+1TB', discount: 10, coupon: 'SSD10', sales: 25, category: 'Discos Duros', stock: 15 },
  { name: 'HDD 2TB', description: 'Disco duro de gran capacidad', price: 80, image: 'https://via.placeholder.com/150?text=HDD+2TB', discount: 0, coupon: '', sales: 15, category: 'Discos Duros', stock: 30 },
  { name: 'SSD 500GB SATA', description: 'Disco sólido SATA', price: 60, image: 'https://via.placeholder.com/150?text=SSD+500GB', discount: 5, coupon: 'SSD5', sales: 10, category: 'Discos Duros', stock: 18 },
  { name: 'Placa Base ASUS ROG', description: 'Placa base para gaming', price: 200, image: 'https://via.placeholder.com/150?text=ASUS+ROG', discount: 0, coupon: '', sales: 20, category: 'Placas Base', stock: 12 },
  { name: 'Placa Base MSI B550', description: 'Placa base compatible con AMD', price: 150, image: 'https://via.placeholder.com/150?text=MSI+B550', discount: 10, coupon: 'MSI10', sales: 15, category: 'Placas Base', stock: 9 },
  { name: 'Placa Base Gigabyte Z490', description: 'Placa base compatible con Intel', price: 180, image: 'https://via.placeholder.com/150?text=Gigabyte+Z490', discount: 0, coupon: '', sales: 10, category: 'Placas Base', stock: 14 },
];

export const loadProducts = async () => {
  try {
    // Eliminar todos los documentos existentes en la colección 'products'
    const querySnapshot = await getDocs(collection(db, 'products'));
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(db, 'products', docSnap.id));
      console.log(`Producto ${docSnap.id} eliminado.`);
    }

    // Cargar los nuevos productos
    for (const product of productsToLoad) {
      await addDoc(collection(db, 'products'), product);
      console.log(`Producto ${product.name} añadido a Firestore.`);
    }
    console.log('Todos los productos han sido cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar productos en Firestore:', error);
    throw error;
  }
};