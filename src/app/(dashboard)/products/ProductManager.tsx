"use client";

import { useState, useMemo } from "react";
import { addProduct, updateProduct, deleteProduct } from "./actions";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";

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
  sold: number;
  category: { id: string; name: string };
}

type StockStatus = "all" | "in-stock" | "low-stock" | "out-of-stock";
type SortBy =
  | "default"
  | "price-asc"
  | "price-desc"
  | "most-discounted"
  | "best-selling";

export default function ProductManager({
  products,
  categories,
  initialCategory = "all",
  initialStock = "all",
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialStock?: StockStatus;
}) {
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter & sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [stockStatus, setStockStatus] = useState<StockStatus>(initialStock);
  const [sortBy, setSortBy] = useState<SortBy>("default");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAll, setShowAll] = useState(false);

  // ── Filtering + Sorting Logic ──────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || p.category.id === selectedCategory;
      const matchesStock =
        stockStatus === "all"
          ? true
          : stockStatus === "in-stock"
            ? p.stock > 10
            : stockStatus === "low-stock"
              ? p.stock > 0 && p.stock <= 10
              : p.stock === 0;
      return matchesSearch && matchesCategory && matchesStock;
    });

    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "best-selling") result = [...result].sort((a, b) => b.sold - a.sold);
    else if (sortBy === "most-discounted") {
      result = [...result].sort((a, b) => {
        const parseDiscount = (d: string) => parseFloat(d.replace("%", "")) || 0;
        return parseDiscount(b.discount) - parseDiscount(a.discount);
      });
    }
    return result;
  }, [products, searchTerm, selectedCategory, stockStatus, sortBy]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    if (showAll) return filteredProducts;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage, showAll]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  function resetFilters() {
    setSearchTerm("");
    setSelectedCategory("all");
    setStockStatus("all");
    setSortBy("default");
    setCurrentPage(1);
  }

  const hasActiveFilters =
    searchTerm || selectedCategory !== "all" || stockStatus !== "all" || sortBy !== "default";

  // ── Handlers ──────────────────────────────────────────────────
  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addProduct(formData);
    if (res.success) {
      setIsAddOpen(false);
      (e.target as HTMLFormElement).reset();
    } else alert(res.error);
    setIsLoading(false);
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentProduct) return;
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateProduct(currentProduct.id, formData);
    if (res.success) { setIsEditOpen(false); setCurrentProduct(null); }
    else alert(res.error);
    setIsLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setIsLoading(true);
    const res = await deleteProduct(id);
    if (!res.success) alert(res.error);
    setIsLoading(false);
  }

  function getStockBadge(stock: number) {
    if (stock > 10)
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          In Stock
        </span>
      );
    if (stock > 0)
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          Low Stock
        </span>
      );
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        Out of Stock
      </span>
    );
  }

  const inputCls =
    "w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors";
  const selectCls =
    "w-full bg-white dark:bg-[#121212] border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-gray-900 dark:text-neutral-200 outline-none focus:border-blue-500 transition-colors";

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            All Products{" "}
            <span className="text-sm font-normal text-[var(--text-muted)]">
              ({filteredProducts.length})
            </span>
          </h2>
          {initialCategory !== "all" && selectedCategory === initialCategory && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Pre-filtered by category —{" "}
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Show all products
              </button>
            </p>
          )}
          {initialStock !== "all" && stockStatus === initialStock && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Pre-filtered by stock status —{" "}
              <button
                onClick={() => setStockStatus("all")}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Show all products
              </button>
            </p>
          )}
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full md:w-auto text-sm font-medium"
        >
          + Add Product
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="dash-card mb-6 space-y-3 !p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Search products…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="ctrl pl-9 pr-8"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={15} />
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="ctrl pl-9 pr-8 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          </div>

          {/* Stock Status */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" size={15} />
            <select
              value={stockStatus}
              onChange={(e) => { setStockStatus(e.target.value as StockStatus); setCurrentPage(1); }}
              className="ctrl pl-9 pr-8 cursor-pointer"
            >
              <option value="all">All Stock Levels</option>
              <option value="in-stock">In Stock (&gt;10)</option>
              <option value="low-stock">Low Stock (1–10)</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as SortBy); setCurrentPage(1); }}
              className="ctrl pr-8 cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="most-discounted">Most Discounted</option>
              <option value="best-selling">Best Selling</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-2.5">
            <span className="text-xs text-[var(--text-muted)]">
              {filteredProducts.length} of {products.length} products
            </span>
            <button onClick={resetFilters}
              className="text-xs font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-neutral-800">
          <p className="text-gray-500 dark:text-neutral-400 mb-2">No products match your filters.</p>
          <button onClick={resetFilters} className="text-blue-500 text-sm hover:underline">
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800 text-sm">
              <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Name</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Category</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Price</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Stock</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Sold</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-neutral-400">Status</th>
                  <th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-neutral-800">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-neutral-200 max-w-[180px] truncate">
                      {product.name}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-neutral-300 whitespace-nowrap">
                      ${product.price.toFixed(2)}
                      {product.discount && (
                        <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          -{product.discount}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-neutral-300">{product.stock}</td>
                    <td className="px-5 py-3 text-gray-700 dark:text-neutral-300">{product.sold ?? 0}</td>
                    <td className="px-5 py-3">{getStockBadge(product.stock)}</td>
                    <td className="px-5 py-3 text-right font-medium whitespace-nowrap">
                      <button
                        onClick={() => { setCurrentProduct(product); setIsDetailsOpen(true); }}
                        className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white mr-1.5 border border-gray-300 dark:border-neutral-700 px-2.5 py-1 rounded text-xs transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => { setCurrentProduct(product); setIsEditOpen(true); }}
                        className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white mr-1.5 border border-gray-300 dark:border-neutral-700 px-2.5 py-1 rounded text-xs transition-colors"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-400 border border-red-200 dark:border-red-900/50 px-2.5 py-1 rounded text-xs transition-colors"
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

          {/* Pagination */}
          <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 py-3 border-t border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-neutral-400">Rows:</span>
                <select
                  value={showAll ? "all" : itemsPerPage}
                  onChange={(e) => {
                    if (e.target.value === "all") { setShowAll(true); }
                    else { setShowAll(false); setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }
                  }}
                  className="bg-transparent border border-gray-300 dark:border-neutral-700 rounded px-2 py-1 text-xs outline-none"
                >
                  {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  <option value="all">All</option>
                </select>
              </div>
              <span className="text-xs text-gray-500 dark:text-neutral-400">
                {showAll
                  ? `All ${filteredProducts.length} items`
                  : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, filteredProducts.length)} of ${filteredProducts.length}`}
              </span>
            </div>

            {!showAll && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-gray-300 dark:border-neutral-700 rounded text-gray-500 dark:text-neutral-400 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                >
                  <ChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 flex items-center justify-center rounded text-xs transition ${currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-gray-300 dark:border-neutral-700 rounded text-gray-500 dark:text-neutral-400 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Details Modal ── */}
      {isDetailsOpen && currentProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 w-full max-w-lg border border-gray-200 dark:border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200 dark:border-neutral-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-neutral-100">Product Details</h3>
              <button onClick={() => { setIsDetailsOpen(false); setCurrentProduct(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-neutral-500 mb-1">Product Name</p>
                <p className="text-gray-900 dark:text-neutral-200 font-medium">{currentProduct.name}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-neutral-500 mb-1">Sold</p>
                  <p className="text-gray-900 dark:text-neutral-200">{currentProduct.sold ?? 0} units</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <p className="text-gray-800 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap p-3 bg-gray-50 dark:bg-[#121212] rounded-md border border-gray-200 dark:border-neutral-800">
                  {currentProduct.description}
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => { setIsDetailsOpen(false); setCurrentProduct(null); }} className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Modal ── */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl w-full max-w-lg border border-gray-200 dark:border-neutral-800 shadow-2xl max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-neutral-100">Add New Product</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20} /></button>
            </div>
            <div className="p-5 overflow-y-auto">
              <form id="add-form" onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Product Name *</label>
                  <input type="text" name="name" id="name" required className={inputCls} />
                </div>
                <div>
                  <label htmlFor="description" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Description *</label>
                  <textarea name="description" id="description" required rows={3} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Price ($) *</label>
                    <input type="number" step="0.01" name="price" id="price" required min="0" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="stock" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Stock Qty *</label>
                    <input type="number" name="stock" id="stock" required min="0" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sold" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Units Sold</label>
                    <input type="number" name="sold" id="sold" min="0" defaultValue={0} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="discount" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Discount</label>
                    <input type="text" name="discount" id="discount" placeholder="e.g. 10%" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label htmlFor="category" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Category *</label>
                  <select name="category" id="category" required className={selectCls}>
                    <option value="">Select a category</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-gray-200 dark:border-neutral-800 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md text-sm transition hover:bg-gray-50 dark:hover:bg-neutral-800" disabled={isLoading}>Cancel</button>
              <button type="submit" form="add-form" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition" disabled={isLoading}>{isLoading ? "Saving…" : "Save Product"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {isEditOpen && currentProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl w-full max-w-lg border border-gray-200 dark:border-neutral-800 shadow-2xl max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-neutral-100">Edit Product</h3>
              <button onClick={() => { setIsEditOpen(false); setCurrentProduct(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20} /></button>
            </div>
            <div className="p-5 overflow-y-auto">
              <form id="edit-form" onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Product Name *</label>
                  <input type="text" name="name" id="edit-name" defaultValue={currentProduct.name} required className={inputCls} />
                </div>
                <div>
                  <label htmlFor="edit-description" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Description *</label>
                  <textarea name="description" id="edit-description" defaultValue={currentProduct.description} required rows={3} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-price" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Price ($) *</label>
                    <input type="number" step="0.01" name="price" id="edit-price" defaultValue={currentProduct.price} required min="0" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="edit-stock" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Stock Qty *</label>
                    <input type="number" name="stock" id="edit-stock" defaultValue={currentProduct.stock} required min="0" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-sold" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Units Sold</label>
                    <input type="number" name="sold" id="edit-sold" defaultValue={currentProduct.sold ?? 0} min="0" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="edit-discount" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Discount</label>
                    <input type="text" name="discount" id="edit-discount" defaultValue={currentProduct.discount} placeholder="e.g. 10%" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label htmlFor="edit-category" className="block text-xs font-medium text-gray-500 dark:text-neutral-400 mb-1">Category *</label>
                  <select name="category" id="edit-category" defaultValue={currentProduct.category.id} required className={selectCls}>
                    <option value="">Select a category</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-gray-200 dark:border-neutral-800 flex justify-end gap-3">
              <button type="button" onClick={() => { setIsEditOpen(false); setCurrentProduct(null); }} className="px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md text-sm transition hover:bg-gray-50 dark:hover:bg-neutral-800" disabled={isLoading}>Cancel</button>
              <button type="submit" form="edit-form" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition" disabled={isLoading}>{isLoading ? "Saving…" : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
