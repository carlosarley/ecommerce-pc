import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Leer los archivos JSON
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));
const products = JSON.parse(readFileSync('./products.json', 'utf8'));

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const importProducts = async () => {
  try {
    // Eliminar todos los documentos existentes en la colección 'products'
    const querySnapshot = await db.collection('products').get();
    for (const doc of querySnapshot.docs) {
      await doc.ref.delete();
      console.log(`Producto ${doc.id} eliminado.`);
    }

    // Cargar los nuevos productos
    for (const product of products) {
      await db.collection('products').add(product);
      console.log(`Producto ${product.name} añadido a Firestore.`);
    }
    console.log('Todos los productos han sido cargados exitosamente.');
  } catch (error) {
    console.error('Error al importar productos:', error);
  }
};

// Ejecutar la función
importProducts();