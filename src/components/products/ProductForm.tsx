'use client';
import { useState } from 'react';

interface ProductFormProps {
  onClose: () => void;
  onAdd: (product: any) => void;
}

export default function ProductForm({ onClose, onAdd, initialData }: any) {
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    discount: '0', 
    stock: '0' 
  });
  const [errors, setErrors] = useState({ name: '', price: '' });
    // const [formData, setFormData] = useState(initialData || { name: '', price: '', category: '' });
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!formData.name || !formData.price) {
      alert("Name and Price are required!");
      return;
    }
    // بنحول الأرقام لـ Numbers عشان الـ Database تقبلها
    onAdd({
      ...formData,
      price: Number(formData.price),
      discount: Number(formData.discount),
      stock: Number(formData.stock)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <div className="bg-gray-100 p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add Product (Database Schema Ready)</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input type="text" className="w-full border p-2 rounded-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price ($) *</label>
              <input type="number" className="w-full border p-2 rounded-lg" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount (%)</label>
              <input type="number" className="w-full border p-2 rounded-lg" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input type="number" className="w-full border p-2 rounded-lg" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full border p-2 rounded-lg" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save to List</button>
          </div>
        </form>
      </div>
    </div>
  );
}
