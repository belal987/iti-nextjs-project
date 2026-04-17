"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { addCategory, updateCategory, deleteCategory } from "./actions";
import { Search, ChevronLeft, ChevronRight, ChevronDown, X, Package, ArrowRight } from "lucide-react";

type SortBy = "name-asc" | "name-desc" | "count-desc" | "count-asc";

interface Category {
  id: string;
  name: string;
  productCount: number;
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search, Sort & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAll, setShowAll] = useState(false);

  const filteredCategories = useMemo(() => {
    const filtered = categories.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "count-desc") return b.productCount - a.productCount;
      if (sortBy === "count-asc") return a.productCount - b.productCount;
      return 0;
    });
  }, [categories, searchTerm, sortBy]);

  const paginatedCategories = useMemo(() => {
    if (showAll) return filteredCategories;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage, showAll]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Handlers
  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addCategory(formData);
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
    if (!currentCategory) return;
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateCategory(currentCategory.id, formData);
    if (res.success) {
      setIsEditOpen(false);
      setCurrentCategory(null);
    } else {
      alert(res.error);
    }
    setIsLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setIsLoading(true);
    const res = await deleteCategory(id);
    if (!res.success) alert(res.error);
    setIsLoading(false);
  }

  function getProductCountBadge(count: number) {
    if (count === 0)
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
          <Package size={11} />
          0 products
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        <Package size={11} />
        {count} product{count !== 1 ? "s" : ""}
      </span>
    );
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
          Category List{" "}
          <span className="text-sm font-normal text-gray-500 dark:text-neutral-500">
            ({filteredCategories.length})
          </span>
        </h2>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full md:w-auto text-sm font-medium"
        >
          + Add Category
        </button>
      </div>

      {/* Filter bar */}
      <div className="dash-card !p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">

          <div className="flex items-center gap-2 flex-1">
            <div className="shrink-0 p-2 bg-slate-50 dark:bg-neutral-800 border border-[var(--border)] rounded-lg text-[var(--text-muted)]">
              <Search size={15} />
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search categories…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="ctrl pr-9"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Sort By */}
          <div className="relative w-full sm:w-56">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value as SortBy); setCurrentPage(1); }}
              className="ctrl pr-12 cursor-pointer"
            >
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
              <option value="count-desc">Most Products</option>
              <option value="count-asc">Fewest Products</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          </div>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-14 bg-white dark:bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-neutral-800">
          <p className="text-gray-500 dark:text-neutral-400 mb-2">
            No categories found{searchTerm ? ` matching "${searchTerm}"` : ""}.
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-blue-500 text-sm hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800 text-sm">
              <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider text-xs">
                    Name
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider text-xs">
                    Products
                  </th>
                  <th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-neutral-800">
                {paginatedCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                  >
                    <td className="px-5 py-3 font-medium">
                      <Link
                        href={`/products?category=${category.id}`}
                        className="group inline-flex items-center gap-1.5 text-[var(--text-primary)] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {category.name}
                        <ArrowRight
                          size={13}
                          className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-blue-500"
                        />
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      {getProductCountBadge(category.productCount)}
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => { setCurrentCategory(category); setIsEditOpen(true); }}
                        className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white mr-1.5 border border-gray-300 dark:border-neutral-700 px-2.5 py-1 rounded text-xs transition-colors"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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
                  {[5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
                  <option value="all">All</option>
                </select>
              </div>
              <span className="text-xs text-gray-500 dark:text-neutral-400">
                {showAll
                  ? `${filteredCategories.length} categories`
                  : `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, filteredCategories.length)} of ${filteredCategories.length}`}
              </span>
            </div>

            {!showAll && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-gray-300 dark:border-neutral-700 rounded disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                >
                  <ChevronLeft size={14} />
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
                  className="p-1.5 border border-gray-300 dark:border-neutral-700 rounded disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Add Modal ── */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-neutral-100">Add New Category</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd}>
              <label htmlFor="name" className="block text-xs font-medium text-gray-600 dark:text-neutral-400 mb-1.5">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                autoFocus
                className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., Electronics"
              />
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {isEditOpen && currentCategory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-neutral-100">Edit Category</h3>
              <button onClick={() => { setIsEditOpen(false); setCurrentCategory(null); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEdit}>
              <label htmlFor="edit-name" className="block text-xs font-medium text-gray-600 dark:text-neutral-400 mb-1.5">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                id="edit-name"
                defaultValue={currentCategory.name}
                required
                autoFocus
                className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2.5 text-sm text-gray-900 dark:text-neutral-100 outline-none focus:border-blue-500 transition-colors"
              />
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => { setIsEditOpen(false); setCurrentCategory(null); }}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
