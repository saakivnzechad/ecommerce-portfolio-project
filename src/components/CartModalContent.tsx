import React, { useState, useEffect, useMemo } from 'react';
import '../App.css';

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  image_url: string | null;
  current_price: string;
  quantity: number;
}

interface SavedAddress {
  id: number;
  address_string: string;
}

interface CartModalContentProps {
  onClose: () => void;
}

const CartModalContent: React.FC<CartModalContentProps> = ({ onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | 'new' | ''>('');
  const [newAddressString, setNewAddressString] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [paymentMethod] = useState<'cash'>('cash');
  const [userName, setUserName] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const cartResponse = await fetch('/api/user/cart.php');
        if (!cartResponse.ok) {
          const errorData = await cartResponse.json();
          throw new Error(errorData.error || `Ошибка при загрузке корзины: ${cartResponse.status}`);
        }
        const cartData = await cartResponse.json();
        setCartItems(cartData.items || []);

        const addressesResponse = await fetch('/api/user/profile.php');
        if (!addressesResponse.ok) {
          const errorData = await addressesResponse.json();
          throw new Error(errorData.error || `Ошибка при загрузке адресов: ${addressesResponse.status}`);
        }
        const addressesData = await addressesResponse.json();
        setSavedAddresses(addressesData.addresses || []);

        if (addressesData.user?.name) {
          setUserName(addressesData.user.name);
        }
        if (addressesData.user?.phone) {
          setPhoneNumber(addressesData.user.phone);
        }

        if (addressesData.addresses && addressesData.addresses.length > 0) {
          setSelectedAddressId(addressesData.addresses[0].id);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Не удалось загрузить данные корзины или адресов.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalSum = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + parseFloat(item.current_price) * item.quantity, 0);
  }, [cartItems]);

  const handleRemoveItem = async (itemId: number) => {
    try {
      const response = await fetch('/api/user/remove.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_item_id: itemId }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      } else {
        setError(result.error || 'Ошибка при удалении товара.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Произошла ошибка при удалении товара.');
    }
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === 'new') {
      setSelectedAddressId('new');
    } else if (value && !isNaN(parseInt(value, 10))) {
      setSelectedAddressId(parseInt(value, 10));
    } else {
      setSelectedAddressId('');
    }
    if (value !== 'new') {
      setNewAddressString('');
    }
  };

  const handleNewAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddressString(event.target.value);
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const saveNewAddress = async (address: string) => {
    try {
      const response = await fetch('/api/user/addresses.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address_string: address,
          details: '',
          label: 'Новый адрес',
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const newAddress = { id: result.address_id, address_string: address };
        setSavedAddresses([...savedAddresses, newAddress]);
        setSelectedAddressId(result.address_id);
        setNewAddressString('');
        return result.address_id;
      } else {
        throw new Error(result.error || `Ошибка при сохранении адреса (статус: ${response.status})`);
      }
    } catch (err) {
      setError(`Не удалось сохранить новый адрес: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
      return null;
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setNotification('Нельзя оформить пустой заказ.');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    let addressToUse = '';
    let addressId = selectedAddressId;

    if (selectedAddressId === 'new') {
      if (!newAddressString.trim()) {
        setNotification('Пожалуйста, введите новый адрес.');
        setTimeout(() => setNotification(null), 3000);
        return;
      }
      const savedAddressId = await saveNewAddress(newAddressString.trim());
      if (!savedAddressId) {
        return;
      }
      addressToUse = newAddressString.trim();
      addressId = savedAddressId;
    } else {
      const selectedSavedAddr = savedAddresses.find(addr => addr.id === selectedAddressId);
      if (!selectedSavedAddr) {
        setNotification('Пожалуйста, выберите адрес доставки.');
        setTimeout(() => setNotification(null), 3000);
        return;
      }
      addressToUse = selectedSavedAddr.address_string;
    }

    if (!phoneNumber.trim()) {
      setNotification('Пожалуйста, укажите номер телефона.');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      const response = await fetch('/api/user/place_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: addressToUse,
          phone: phoneNumber.trim(),
          comment: comment.trim(),
          payment_method: paymentMethod,
          address_id: addressId !== 'new' ? addressId : undefined,
          customer_name: userName,
        }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setNotification('Заказ успешно оформлен!');
        setTimeout(() => {
          setNotification(null);
          setCartItems([]);
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Ошибка при оформлении заказа.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Произошла ошибка при оформлении заказа.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[600px] text-[#BBBBBB]">
        <p>Загрузка корзины...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-[600px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full gap-4">
      <div className="flex flex-col gap-8 w-full px-4 flex-grow">
        <div className="flex flex-col gap-6 w-full">
          <h2 className="text-2xl font-semibold leading-none text-[#BBBBBB] tracking-[-0.04em]">Детали доставки</h2>
          <div className="w-full flex flex-col gap-2">
            <p className="text-xs text-[#BBBBBB] leading-none font-medium">Адрес</p>
            <select
              value={selectedAddressId}
              onChange={handleAddressChange}
              className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Выберите адрес
              </option>
              {savedAddresses.map(address => (
                <option key={address.id} value={address.id}>
                  {address.address_string}
                </option>
              ))}
              <option value="new" className="font-medium">
                Ввести новый адрес
              </option>
            </select>
            {selectedAddressId === 'new' && (
              <input
                type="text"
                value={newAddressString}
                onChange={handleNewAddressChange}
                className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal placeholder:text-[#BBBBBB] mt-2"
                placeholder="Введите ваш новый адрес"
                autoFocus
              />
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <p className="text-xs text-[#BBBBBB] leading-none font-medium">Телефон</p>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal placeholder:text-[#BBBBBB]"
              placeholder="Введите номер телефона"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <p className="text-xs text-[#BBBBBB] leading-none font-medium">Комментарий к заказу (опционально)</p>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              rows={3}
              className="w-full px-4 py-3 bg-[#F0F0F0] rounded-2xl text-sm text-[#1f1f1f] leading-normal font-normal placeholder:text-[#BBBBBB] resize-none"
              placeholder="Например: домофон 2#76, не звонить в дверь"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-2xl font-semibold leading-none text-[#BBBBBB] tracking-[-0.04em]">Способ оплаты</h2>
          <div className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal">
            <p>Наличными</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 flex-grow">
        <h2 className="text-2xl font-semibold leading-none text-[#BBBBBB] tracking-[-0.04em]">Ваши товары</h2>
        <div className="flex flex-col gap-4 p-4 bg-[#F0F0F0] rounded-xl h-fit">
          <div className="flex flex-col min-w-[320px] h-[400px] w-full pr-4 overflow-y-auto custom-scroll gap-6">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-full pr-8 flex flex-row gap-4 rounded-lg overflow-hidden items-center relative"
                >
                  <div className="w-[80px] h-[80px] overflow-hidden flex-shrink-0 rounded-lg">
                    <img
                      src={item.image_url || '/placeholder-image.png'}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-center gap-2">
                    <h3 className="text-black text-base font-medium leading-snug text-left">{item.name}</h3>
                    <div className="flex items-baseline text-left gap-2">
                      <span className="text-[#F64831] text-lg font-semibold leading-none">{item.current_price} ₽</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-2 right-2 text-[#BBBBBB] hover:text-[#F64831] transition-colors duration-200 focus:outline-none"
                    aria-label={`Удалить ${item.name} из корзины`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-[#BBBBBB] text-base font-medium py-8">Ваша корзина пуста</p>
            )}
          </div>
        </div>
        <button
          onClick={handlePlaceOrder}
          className="w-full px-12 py-4 mt-4 bg-[#F64831] text-white leading-none text-base font-semibold rounded-full text-center hover:bg-[#E53720] transition-colors duration-200"
          disabled={cartItems.length === 0 || (selectedAddressId === 'new' && !newAddressString.trim()) || !phoneNumber.trim()}
        >
          {cartItems.length > 0 ? `Оплатить ${totalSum.toFixed(2).replace('.00', '')} ₽` : 'Корзина пуста'}
        </button>
        {notification && (
          <div className="mt-4 p-4 bg-[#F64831] text-white text-center rounded-xl animate-fade-in">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModalContent;