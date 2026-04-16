'use client';
import { useState, useEffect } from 'react';
import ProductForm from '@/components/products/ProductForm';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 1. كل الـ States لازم تكون فوق
  const [products, setProducts] = useState([
    { id: 1, name: 'Sample Watch', price: 250, stock: 10, discount: 5, category: 'Electronics' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. الـ Effects
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 3. الدوال (Functions)
  const addProduct = (newProduct: any) => {
    setProducts([...products, { ...newProduct, id: Date.now() }]);
  };

  const deleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // 4. شروط الـ Render (بتتحط بعد الـ Hooks)
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  // لو مش مسجل دخول، بنرجع null لحد ما الـ useEffect تعمل redirect
  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
            <p className="text-gray-500">Manage your inventory, prices, and categories.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm"
          >
            + Add Product
          </button>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Discount</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">${product.price}</td>
                  <td className="px-6 py-4 text-blue-600 font-bold">{product.stock || 0} units</td>
                  <td className="px-6 py-4 text-green-600">%{product.discount || 0}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-indigo-600 hover:text-indigo-900 px-3 py-1 font-medium transition">Edit</button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900 px-3 py-1 font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductForm 
          onClose={() => setIsModalOpen(false)} 
          onAdd={addProduct} 
        />
      )}
    </div>
  );
}