'use client';
import { useState, useEffect } from 'react';
import ProductForm from '@/components/products/ProductForm';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. دالة لجلب البيانات من الـ Database
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProducts();
    }
  }, [status, router]);

  // 2. دالة إضافة منتج حقيقي للداتا بيز
  const addProduct = async (productData: any) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        fetchProducts(); // بنحدث الجدول بعد الإضافة
      }
    } catch (error) {
      alert("Error adding product");
    }
  };

  // 3. دالة حذف منتج من الداتا بيز
  const deleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setProducts(products.filter((p: any) => p._id !== id));
        }
      } catch (error) {
        alert("Error deleting product");
      }
    }
  };

  if (status === "loading" || loading) return <p className="p-8 text-center">Loading Data...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-500">Real-time data from MongoDB.</p>
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
                    <th className="px-6 py-4 font-semibold text-gray-600">Product Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Price</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Stock</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product: any) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600">${product.price}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{product.stock} units</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-600 hover:text-red-900 px-3 py-1 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductForm onClose={() => setIsModalOpen(false)} onAdd={addProduct} />
      )}
    </div>
  );
}