import React from 'react';
import '../App.css';
import { useAuth } from '../contexts/AuthContext';

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

interface ProductCardProps {
  item: ProductItem;
  onAddToCart: (productId: number) => void;
  onOpenAuthModal: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAddToCart, onOpenAuthModal }) => {
  const { isAuthenticated } = useAuth();
  const description = item.description || 'Описание отсутствует.';

  const handleAddToCartClick = () => {
    if (isAuthenticated) {
      onAddToCart(item.id);
    } else {
      onOpenAuthModal();
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)] overflow-hidden p-4 w-full gap-2">
      <div className="w-full aspect-[8/7] overflow-hidden">
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
      <div className="flex flex-col gap-y-2.5 text-left w-full">
        <h3 className="text-black text-base font-medium leading-none">{item.name}</h3>
        {(item.weight || item.calories) && (
          <p className="text-[#BBBBBB] text-xs font-normal leading-none">
            {item.weight && `${item.weight}`}
            {item.weight && item.calories && '; '}
            {item.calories && `${item.calories}`}
          </p>
        )}
      </div>
      {description && description !== 'Описание отсутствует.' && (
        <p className="text-[#1f1f1f] text-xs font-normal text-justify line-clamp-3 pt-1 w-full">{description}</p>
      )}
      <div className="flex items-baseline text-left gap-2 py-3 w-full">
        <span className="text-[#F64831] text-[1.75rem] font-semibold leading-none">{item.current_price} ₽</span>
        {item.old_price && (
          <span className="text-black text-xs font-semibold leading-none line-through">{item.old_price} ₽</span>
        )}
      </div>
      <button
        onClick={handleAddToCartClick}
        className="py-2 w-full bg-white border border-[#F64831] text-[#F64831] leading-none text-base font-medium rounded-md text-center hover:bg-[#F64831] hover:text-white transition-colors duration-200"
      >
        В корзину
      </button>
    </div>
  );
};

export default ProductCard;