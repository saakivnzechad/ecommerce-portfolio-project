import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import PopularItemsSection from '../components/PopularItemsSection';
import ProductSection from '../components/ProductSection';
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

interface HomePageProps {
  onAddToCart: (productId: number) => void;
  onOpenAuthModal: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAddToCart, onOpenAuthModal }) => {
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setProductsError(null);
        const response = await fetch('/api/products.php');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        const data: ProductItem[] = await response.json();
        setAllProducts(data);
      } catch (err) {
        console.error('Ошибка при загрузке товаров:', err);
        setProductsError(err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке товаров.');
      } finally {
        setIsLoadingProducts(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoriesError(null);
        const response = await fetch('/api/categories.php');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        const data: CategoryItem[] = await response.json();
        const allOption = { id: null, name: 'Все категории', display_order: -1 };
        setCategories([allOption, ...data]);
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
        setCategoriesError(err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке категорий.');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts =
    selectedCategoryId === null
      ? allProducts
      : allProducts.filter(product => product.category_id === selectedCategoryId);

  if (isLoadingProducts || isLoadingCategories) {
    return (
      <div className="App">
        <main className="container mx-auto px-4 py-8 text-center text-[#BBBBBB] text-lg">
          Загрузка данных...
        </main>
      </div>
    );
  }

  if (productsError || categoriesError) {
    return (
      <div className="App">
        <main className="container mx-auto px-4 py-8 text-center text-red-500 text-lg">
          {productsError && <p>Ошибка загрузки товаров: {productsError}</p>}
          {categoriesError && <p>Ошибка загрузки категорий: {categoriesError}</p>}
          {!productsError && !categoriesError && <p>Неизвестная ошибка загрузки.</p>}
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <main>
        <HeroSection />
        <PopularItemsSection onAddToCart={onAddToCart} onOpenAuthModal={onOpenAuthModal} />
        <ProductSection
          products={filteredProducts}
          allCategories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
          onAddToCart={onAddToCart}
          onOpenAuthModal={onOpenAuthModal}
        />
      </main>
    </div>
  );
};

export default HomePage;