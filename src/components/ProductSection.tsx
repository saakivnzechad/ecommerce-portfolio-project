import React from 'react';
import ProductCard from './ProductCard';
import CategoryFilterSection from './CategoryFilterSection';
import '../App.css';

interface ProductItem {
  id: number;
  category_id: number | null;
  category_name: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  current_price: string;
  old_price: string | null;
  calories: string | null;
  weight: string | null;
}

interface CategoryItem {
  id: number | null;
  name: string;
  display_order: number | null;
}

interface ProductSectionProps {
  products: ProductItem[];
  allCategories: CategoryItem[];
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  onAddToCart: (productId: number) => void;
  onOpenAuthModal: () => void;
}

const ProductsSection: React.FC<ProductSectionProps> = ({
  products,
  allCategories,
  selectedCategoryId,
  onCategorySelect,
  onAddToCart,
  onOpenAuthModal,
}) => {
  const itemsToDisplay = products;

  return (
    <section id="menu" className="container mx-auto px-2 mt-16 flex flex-col gap-y-8">
      <h2 className="text-left text-3xl font-semibold text-[#BBBBBB] leading-none tracking-[-0.04em]">
        Каталог товаров
      </h2>
      {allCategories.length > 0 && (
        <CategoryFilterSection
          categories={allCategories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={onCategorySelect}
        />
      )}
      {itemsToDisplay.length === 0 && (
        <p className="text-center text-[#BBBBBB] text-lg mb-16">
          {selectedCategoryId === null ? 'Нет товаров для отображения.' : 'Нет товаров в этой категории.'}
        </p>
      )}
      {itemsToDisplay.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12 pb-16">
          {itemsToDisplay.map(item => (
            <ProductCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
              onOpenAuthModal={onOpenAuthModal}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductsSection;