import React, { useEffect, useState } from 'react';
import '../App.css';
import { useAuth } from '../contexts/AuthContext';

interface PopularItemsSectionProps {
  onAddToCart: (productId: number) => void;
  onOpenAuthModal: () => void;
}

interface PopularItem {
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

const PopularItemsSection: React.FC<PopularItemsSectionProps> = ({ onAddToCart, onOpenAuthModal }) => {
  const { isAuthenticated } = useAuth();
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/popular-items.php');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        const data: PopularItem[] = await response.json();
        setPopularItems(data);
      } catch (err) {
        console.error('Ошибка при загрузке популярных товаров:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка при загрузке популярных товаров.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularItems();
  }, []);

  const itemsToDisplay = popularItems;

  const handleAddToCartClick = (productId: number) => {
    if (isAuthenticated) {
      onAddToCart(productId);
    } else {
      onOpenAuthModal();
    }
  };

  return (
    <section className="container mx-auto px-2 mt-16 flex flex-col gap-y-8">
      <h2 className="text-left text-3xl font-semibold text-[#BBBBBB] leading-none tracking-[-0.04em]">
        Часто заказывают
      </h2>
      {isLoading && <p className="text-center text-[#BBBBBB]">Загрузка популярных товаров...</p>}
      {error && <p className="text-center text-red-500">Ошибка загрузки: {error}</p>}
      {!isLoading && !error && popularItems.length === 0 && (
        <p className="text-center text-[#BBBBBB]">Нет популярных товаров для отображения.</p>
      )}
      {!isLoading && !error && itemsToDisplay.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12 pb-16">
          {itemsToDisplay.map(item => (
            <div
              key={item.id}
              className="flex-shrink-0 w-full flex flex-row p-4 gap-2 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              <div className="w-[120px] h-[110px] overflow-hidden flex-shrink-0 rounded-lg">
                <img
                  src={item.image_url || '/placeholder.png'}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/placeholder.png';
                  }}
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <h3 className="text-black text-base font-medium leading-none text-left">{item.name}</h3>
                <div className="flex items-baseline text-left gap-2">
                  <span className="text-[#F64831] text-xl font-semibold leading-none">{item.current_price} ₽</span>
                  {item.old_price && (
                    <span className="text-black text-xs font-semibold leading-none line-through">
                      {item.old_price} ₽
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCartClick(item.id)}
                  className="px-12 py-2 bg-white border border-[#F64831] text-[#F64831] leading-none text-sm font-medium rounded-lg text-center hover:bg-[#F64831] hover:text-white transition-colors duration-200"
                >
                  В корзину
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularItemsSection;