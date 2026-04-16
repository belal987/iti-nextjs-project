"use client";

import { useState, useMemo } from "react";
import { addProduct, updateProduct, deleteProduct } from "./actions";
import { Search, Filter, ChevronLeft, ChevronRight, X } from "lucide-react";

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
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search, Filter, Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAll, setShowAll] = useState(false);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || product.category.id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Pagination Logic
  const paginatedProducts = useMemo(() => {
    if (showAll) return filteredProducts;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage, showAll]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handlers
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
          All products <span className="text-sm font-normal text-gray-500 dark:text-neutral-500">({filteredProducts.length})</span>
        </h2>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full md:w-auto"
        >
          + Add product
        </button>
      </div>

      {/* Controls: Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-neutral-800 rounded-md text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-neutral-800 rounded-md text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors appearance-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-neutral-800">
          <p className="text-gray-500 dark:text-neutral-400">No products found for your criteria.</p>
          <button 
            onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
            className="mt-4 text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800 text-sm">
              <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Name</th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Category</th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Price</th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Stock</th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Status</th>
                  <th scope="col" className="px-6 py-3 text-right font-medium text-gray-500 dark:text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-neutral-800">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-neutral-200">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs">{product.category.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-neutral-300">
                      ${product.price.toFixed(2)}
                      {product.discount && <span className="ml-2 text-xs text-green-600 dark:text-green-400">-{product.discount}</span>}
                    </td>
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

          {/* Pagination Controls */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-neutral-400">Rows per page:</span>
                <select
                  value={showAll ? "all" : itemsPerPage}
                  onChange={(e) => {
                    if (e.target.value === "all") {
                      setShowAll(true);
                    } else {
                      setShowAll(false);
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }
                  }}
                  className="bg-transparent border border-gray-300 dark:border-neutral-700 rounded px-2 py-1 text-sm outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value="all">All</option>
                </select>
              </div>
              <span className="text-sm text-gray-600 dark:text-neutral-400">
                {showAll 
                  ? `Showing all ${filteredProducts.length} items` 
                  : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredProducts.length)} of ${filteredProducts.length} items`}
              </span>
            </div>

            {!showAll && totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 dark:border-neutral-700 rounded text-gray-600 dark:text-neutral-400 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded text-sm transition ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 dark:border-neutral-700 rounded text-gray-600 dark:text-neutral-400 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </>
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
