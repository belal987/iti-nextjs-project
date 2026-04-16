"use client";

import { useState } from "react";
import { addProduct, updateProduct, deleteProduct } from "./actions";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: string;
  stock: number;
  category: { id: string; name: string };
}

export default function ProductManager({ products, categories }: { products: Product[], categories: Category[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addProduct(formData);
    
    if (res.success) {
      setIsAddOpen(false);
      (e.target as HTMLFormElement).reset();
    } else {
      alert(res.error);
    }
    setIsLoading(false);
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentProduct) return;
    
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateProduct(currentProduct.id, formData);
    
    if (res.success) {
      setIsEditOpen(false);
      setCurrentProduct(null);
    } else {
      alert(res.error);
    }
    setIsLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setIsLoading(true);
    const res = await deleteProduct(id);
    
    if (!res.success) {
      alert(res.error);
    }
    setIsLoading(false);
  }

  function getStockBadge(stock: number) {
    if (stock > 10) return <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">In stock</span>;
    if (stock > 0) return <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Low stock</span>;
    return <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Out of stock</span>;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">All products <span className="text-sm font-normal text-gray-500 dark:text-neutral-500">({products.length})</span></h2>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-transparent border border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-neutral-200 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#252525] transition"
        >
          + Add product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 dark:text-neutral-400">No products found. Start by adding one!</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800 text-sm">
            <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Name</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Category</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Price</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Discount</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Stock</th>
                <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Status</th>
                <th scope="col" className="px-6 py-3 text-right font-medium text-gray-500 dark:text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-neutral-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-neutral-200">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs">{product.category.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-neutral-300">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-neutral-300">{product.discount || "—"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-neutral-300">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStockBadge(product.stock)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                     <button 
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsDetailsOpen(true);
                      }}
                      className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white mr-2 border border-gray-300 dark:border-neutral-700 px-3 py-1 rounded transition-colors"
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsEditOpen(true);
                      }}
                      className="text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white mr-2 border border-gray-300 dark:border-neutral-700 px-3 py-1 rounded transition-colors"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-400 border border-red-200 dark:border-red-900/50 px-3 py-1 rounded transition-colors"
                      disabled={isLoading}
                    >
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsOpen && currentProduct && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-lg p-6 w-full max-w-lg border border-gray-200 dark:border-neutral-800 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-neutral-100 border-b border-gray-200 dark:border-neutral-800 pb-2">Product Details</h3>
            <div className="space-y-4 my-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-neutral-500 mb-1">Product Name</p>
                <p className="text-gray-900 dark:text-neutral-200 font-medium">{currentProduct.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-neutral-500 mb-1">Price</p>
                  <p className="text-gray-900 dark:text-neutral-200">${currentProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-neutral-500 mb-1">Stock</p>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 dark:text-neutral-200">{currentProduct.stock}</p>
                    {getStockBadge(currentProduct.stock)}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-neutral-500 mb-1">Discount</p>
                  <p className="text-gray-900 dark:text-neutral-200">{currentProduct.discount || "None"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-neutral-500 mb-1">Category</p>
                  <p className="text-gray-900 dark:text-neutral-200">{currentProduct.category.name}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-neutral-500 mb-1">Description</p>
                <p className="text-gray-800 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap p-3 bg-gray-50 dark:bg-[#121212] rounded-md border border-gray-200 dark:border-neutral-800">{currentProduct.description}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => { setIsDetailsOpen(false); setCurrentProduct(null); }} 
                className="px-6 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-lg w-full max-w-lg border border-gray-200 dark:border-neutral-800 shadow-xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-800">
               <h3 className="text-lg font-bold text-gray-900 dark:text-neutral-100">Add new product</h3>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="add-form" onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Product name</label>
                  <input type="text" name="name" id="name" required className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Description</label>
                  <textarea name="description" id="description" required rows={3} className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Price ($)</label>
                    <input type="number" step="0.01" name="price" id="price" required min="0" className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="stock" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Stock quantity</label>
                    <input type="number" name="stock" id="stock" required min="0" className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="discount" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Discount</label>
                    <input type="text" name="discount" id="discount" placeholder="e.g. 10%" className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Category</label>
                    <select name="category" id="category" required className="w-full bg-white dark:bg-[#121212] border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors">
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-neutral-800 flex justify-end gap-3">
               <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md transition hover:bg-gray-50 dark:hover:bg-neutral-800" disabled={isLoading}>Cancel</button>
               <button type="submit" form="add-form" className="px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md transition hover:bg-gray-50 dark:hover:bg-neutral-800" disabled={isLoading}>{isLoading ? "Saving..." : "Save product"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && currentProduct && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-lg w-full max-w-lg border border-gray-200 dark:border-neutral-800 shadow-xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-800">
               <h3 className="text-lg font-bold text-gray-900 dark:text-neutral-100">Edit product</h3>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="edit-form" onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Product name</label>
                  <input type="text" name="name" id="edit-name" defaultValue={currentProduct.name} required className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="edit-description" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Description</label>
                  <textarea name="description" id="edit-description" defaultValue={currentProduct.description} required rows={3} className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-price" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Price ($)</label>
                    <input type="number" step="0.01" name="price" id="edit-price" defaultValue={currentProduct.price} required min="0" className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="edit-stock" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Stock quantity</label>
                    <input type="number" name="stock" id="edit-stock" defaultValue={currentProduct.stock} required min="0" className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-discount" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Discount</label>
                    <input type="text" name="discount" id="edit-discount" defaultValue={currentProduct.discount} placeholder="e.g. 10%" className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="edit-category" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Category</label>
                    <select name="category" id="edit-category" defaultValue={currentProduct.category.id} required className="w-full bg-white dark:bg-[#121212] border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors">
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-neutral-800 flex justify-end gap-3">
               <button type="button" onClick={() => { setIsEditOpen(false); setCurrentProduct(null); }} className="px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md transition hover:bg-gray-50 dark:hover:bg-neutral-800" disabled={isLoading}>Cancel</button>
               <button type="submit" form="edit-form" className="px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md transition hover:bg-gray-50 dark:hover:bg-neutral-800" disabled={isLoading}>{isLoading ? "Saving..." : "Save changes"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
