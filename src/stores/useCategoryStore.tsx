import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
}

interface CategoryStore {
  categories: Category[];
  addCategory: (name: string, color?: string) => Category;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [
        {
          id: 'uncategorized',
          name: 'Uncategorized',
          createdAt: new Date(),
        },
      ],

      addCategory: (name: string, color?: string) => {
        const newCategory = {
          id: crypto.randomUUID(),
          name,
          color,
          createdAt: new Date(),
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
        }));

        return newCategory;
      },

      updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id
              ? { ...category, ...updates }
              : category
          ),
        }));
      },

      deleteCategory: (id: string) => {
        if (id === 'uncategorized') return; // Prevent deletion of uncategorized category
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },

      getCategoryById: (id: string) => {
        return get().categories.find((category) => category.id === id);
      },
    }),
    {
      name: 'category-storage',
    }
  )
);