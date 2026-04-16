"use client";

import { useState, useMemo } from "react";
import { addCategory, updateCategory, deleteCategory } from "./actions";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search and Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAll, setShowAll] = useState(false);

  // Filtering Logic
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Pagination Logic
  const paginatedCategories = useMemo(() => {
    if (showAll) return filteredCategories;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
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
    
    if (!res.success) {
      alert(res.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
          Category List <span className="text-sm font-normal text-gray-500 dark:text-neutral-500">({filteredCategories.length})</span>
        </h2>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full md:w-auto"
        >
          Add Category
        </button>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
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
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-neutral-800">
          <p className="text-gray-500 dark:text-neutral-400">No categories found matching "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm("")}
            className="mt-4 text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
              <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-neutral-800">
                {paginatedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-neutral-200">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => {
                          setCurrentCategory(category);
                          setIsEditOpen(true);
                        }}
                        className="text-gray-600 dark:text-neutral-400 hover:text-white mr-2 border border-gray-300 dark:border-neutral-700 px-3 py-1 rounded transition-colors"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
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

          {/* Pagination */}
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-neutral-400">Rows:</span>
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
                  <option value="all">All</option>
                </select>
              </div>
              <span className="text-sm text-gray-600 dark:text-neutral-400">
                {showAll 
                  ? `${filteredCategories.length} categories` 
                  : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredCategories.length)} of ${filteredCategories.length}`}
              </span>
            </div>

            {!showAll && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 dark:border-neutral-700 rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  <ChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded text-sm transition ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 dark:border-neutral-700 rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-lg p-6 w-full max-w-md border border-gray-200 dark:border-neutral-800">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-neutral-100">Add New Category</h3>
            <form onSubmit={handleAdd}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Category Name
                </label>
                <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  required 
                  className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2 text-gray-900 dark:text-neutral-100 outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g., Electronics"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && currentCategory && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-lg p-6 w-full max-w-md border border-gray-200 dark:border-neutral-800">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-neutral-100">Edit Category</h3>
            <form onSubmit={handleEdit}>
              <div className="mb-4">
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Category Name
                </label>
                <input 
                  type="text" 
                  name="name" 
                  id="edit-name" 
                  defaultValue={currentCategory.name}
                  required 
                  className="w-full bg-transparent border border-gray-300 dark:border-neutral-700 rounded-md px-3 py-2 text-gray-900 dark:text-neutral-100 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditOpen(false);
                    setCurrentCategory(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md transition"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
