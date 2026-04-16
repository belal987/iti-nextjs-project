"use client";

import { useState } from "react";
import { addCategory, updateCategory, deleteCategory } from "./actions";

interface Category {
  id: string;
  name: string;
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Category List</h2>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500 dark:text-neutral-400">No categories found. Start by adding one!</p>
      ) : (
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
              {categories.map((category) => (
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
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
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
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
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
