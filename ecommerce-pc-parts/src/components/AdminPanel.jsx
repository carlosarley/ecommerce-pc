import { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';

const AdminPanel = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useContext(ProductContext);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    discount: 0,
    coupon: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, newProduct);
      setEditingProduct(null);
    } else {
      addProduct(newProduct);
    }
    setNewProduct({ name: '', description: '', price: 0, image: '', discount: 0, coupon: '' });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
  };

  const handleDelete = (id) => {
    deleteProduct(id);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-100 p-4 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Descripción</label>
            <input
              type="text"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Precio</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">URL de la Imagen</label>
            <input
              type="text"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Descuento (%)</label>
            <input
              type="number"
              value={newProduct.discount}
              onChange={(e) => setNewProduct({ ...newProduct, discount: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-gray-700">Cupón</label>
            <input
              type="text"
              value={newProduct.coupon}
              onChange={(e) => setNewProduct({ ...newProduct, coupon: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setNewProduct({ name: '', description: '', price: 0, image: '', discount: 0, coupon: '' });
            }}
            className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        )}
      </form>

      <h2 className="text-2xl font-bold mb-4">Lista de Productos</h2>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center border p-4 rounded-lg shadow-lg">
            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover mr-4" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-gray-600">
                Precio: ${product.price} | Descuento: {product.discount}% | Cupón: {product.coupon || 'N/A'}
              </p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;