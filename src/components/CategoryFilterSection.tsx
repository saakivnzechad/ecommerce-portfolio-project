import React from 'react';
import '../App.css';

interface CategoryItem {
  id: number | null;
  name: string;
  display_order: number | null;
}

interface CategoryFilterSectionProps {
  categories: CategoryItem[];
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

const CategoryFilterSection: React.FC<CategoryFilterSectionProps> = ({ categories, selectedCategoryId, onCategorySelect }) => {
  const handleCategoryClick = (categoryId: number | null) => {
    onCategorySelect(categoryId);
  };

  const categoriesToDisplay = categories;

  return (
    <div className="flex flex-wrap gap-4">
      {categoriesToDisplay.map(category => (
        <button
          key={category.id === null ? 'all' : category.id}
          className={`
            flex-shrink-0 px-6 md:px-8 lg:px-10 py-2 md:py-3 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)] text-sm md:text-base font-medium leading-none
            transition-colors duration-200 ease-in-out cursor-pointer
            ${selectedCategoryId === category.id ? 'bg-[#F64831] text-white' : 'bg-white text-black hover:bg-[#EAEAEA]'}
          `}
          onClick={() => handleCategoryClick(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilterSection;