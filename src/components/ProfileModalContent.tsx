import React, { useState, useEffect } from 'react';
import '../App.css';
import { useAuth } from '../contexts/AuthContext';

interface ProfileModalContentProps {
  onClose: () => void;
}

interface UserData {
  user_hex_id: string;
  name: string;
  phone: string;
  email: string | null;
  dob: string | null;
}

interface OrderItem {
  id: number;
  product_name: string;
  price_at_order: string;
  quantity: number;
  details_at_order: string | null;
}

interface UserOrder {
  id: number;
  order_hex_id: string;
  total_amount: string;
  status: 'new' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  status_text: string;
  delivery_address: string;
  comment: string | null;
  ordered_at: string;
  delivery_time_minutes: number | null;
  items: OrderItem[];
}

const formatDisplayDate = (dateString: string | null): string => {
  if (!dateString) return 'Не указана';
  try {
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      return `${day}.${month}.${year}`;
    }
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const d = date.getDate().toString().padStart(2, '0');
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      const y = date.getFullYear();
      return `${d}.${m}.${y}`;
    }
    return dateString;
  } catch (error) {
    console.error('Ошибка форматирования даты:', error);
    return dateString;
  }
};

const ProfileModalContent: React.FC<ProfileModalContentProps> = () => {
  useAuth();
  const { logout } = useAuth();
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [isEditingDob, setIsEditingDob] = useState(false);
  const [editingDobValue, setEditingDobValue] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/user/profile.php');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        setProfileData(data.user);
        setUserOrders(data.orders || []);
        setEditingNameValue(data.user?.name || '');
        setEditingDobValue(data.user?.dob || '');
      } catch (err) {
        console.error('Ошибка при загрузке данных профиля:', err);
        setError('Не удалось загрузить данные профиля.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      setEditingNameValue(profileData.name || '');
      setEditingDobValue(profileData.dob || '');
    }
  }, [profileData]);

  const handleSaveNameClick = async () => {
    try {
      const response = await fetch('/api/user/update_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingNameValue }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setProfileData(prev => (prev ? { ...prev, name: editingNameValue } : null));
        setIsEditingName(false);
      } else {
        setError(result.error || 'Ошибка при сохранении имени.');
        console.error('Ошибка сохранения имени:', result.error);
      }
    } catch (err) {
      setError('Произошла ошибка при сохранении имени.');
      console.error('Ошибка запроса сохранения имени:', err);
    }
  };

  const handleSaveDobClick = async () => {
    try {
      const response = await fetch('/api/user/update_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dob: editingDobValue }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setProfileData(prev => (prev ? { ...prev, dob: editingDobValue } : null));
        setIsEditingDob(false);
      } else {
        setError(result.error || 'Ошибка при сохранении даты рождения.');
        console.error('Ошибка сохранения даты рождения:', result.error);
      }
    } catch (err) {
      setError('Произошла ошибка при сохранении даты рождения.');
      console.error('Ошибка запроса сохранения даты рождения:', err);
    }
  };

  const handleEditNameClick = () => {
    setEditingNameValue(profileData?.name || '');
    setIsEditingName(true);
  };
  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditingNameValue(e.target.value);
  const handleNameInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSaveNameClick();
  };

  const handleEditDobClick = () => {
    setEditingDobValue(profileData?.dob || '');
    setIsEditingDob(true);
  };
  const handleDobInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditingDobValue(e.target.value);
  const handleDobInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSaveDobClick();
  };
  const handleLogoutClick = async () => {
      try {
       await logout();
       onclose = null;
      } catch (err) {
       console.error('Ошибка при выходе:', err);
       setError('Не удалось выполнить выход. Попробуйте еще раз.');
      }
     };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[400px] text-[#BBBBBB]">
        <p>Загрузка данных профиля...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-[400px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row w-full gap-4">
      <div className="flex flex-col gap-12 w-full px-4">
        <div className="flex flex-col gap-6 w-full">
          <h2 className="text-2xl font-semibold leading-none text-[#BBBBBB] tracking-[-0.04em]">Личные данные</h2>
          <div className="w-full flex flex-col gap-2">
            <p className="text-xs text-[#BBBBBB] leading-none font-medium">Имя</p>
            {isEditingName ? (
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={editingNameValue}
                  onChange={handleNameInputChange}
                  onKeyPress={handleNameInputKeyPress}
                  className="px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal placeholder:text-[#BBBBBB] max-w-[160px]"
                  placeholder="Введите имя"
                  autoFocus
                />
                <button
                  onClick={handleSaveNameClick}
                  className="text-[#F64831] font-normal text-xs leading-none hover:underline transition-colors duration-200 flex-shrink-0"
                  aria-label="Сохранить имя"
                >
                  Сохранить
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal gap-4">
                <p className="flex-grow text-[#1f1f1f] leading-none">{profileData?.name || 'Не указано'}</p>
                <button
                  onClick={handleEditNameClick}
                  className="flex-shrink-0 text-[#F64831] font-normal text-xs leading-none hover:underline transition-colors duration-200"
                  aria-label="Изменить имя"
                >
                  Изменить
                </button>
              </div>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <p className="text-xs text-[#BBBBBB] leading-none font-medium">Дата рождения</p>
            {isEditingDob ? (
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={editingDobValue}
                  onChange={handleDobInputChange}
                  onKeyPress={handleDobInputKeyPress}
                  className="flex-grow px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal placeholder:text-[#BBBBBB]"
                  placeholder="Выберите дату"
                  autoFocus
                />
                <button
                  onClick={handleSaveDobClick}
                  className="text-[#F64831] font-normal text-xs leading-none hover:underline transition-colors duration-200 flex-shrink-0"
                  aria-label="Сохранить дату рождения"
                >
                  Сохранить
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal gap-4">
                <p className="flex-grow text-[#1f1f1f] leading-none">{formatDisplayDate(profileData?.dob ?? null)}</p>
                <button
                  onClick={handleEditDobClick}
                  className="flex-shrink-0 text-[#F64831] font-normal text-xs leading-none hover:underline transition-colors duration-200"
                  aria-label="Изменить дату рождения"
                >
                  Изменить
                </button>
              </div>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <p className="text-xs text-[#BBBBBB] leading-none font-medium">Телефон</p>
            <p className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal">
              {profileData?.phone || 'Не указан'}
            </p>
          </div>
          <div className="w-full flex flex-col gap-2">
            <p className="text-xs text-[#BBBBBB] leading-none font-medium">Email</p>
            <p className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal">
              {profileData?.email || 'Не указан'}
            </p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="text-[#F64831] font-normal text-xs leading-none hover:underline transition-colors duration-200 self-start" // self-start для выравнивания по левому краю в колонке
            aria-label="Выйти из профиля"
            >
            Выйти
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-2xl font-semibold leading-none text-[#BBBBBB] tracking-[-0.04em]">Заказы</h2>
        <div className="flex flex-row gap-4 pr-4 py-4 bg-[#F0F0F0] rounded-xl">
          <div className="flex flex-col w-full px-4 overflow-y-auto custom-scroll max-h-[460px]">
            {userOrders.length > 0 ? (
              userOrders.map(order => (
                <article
                  key={order.id}
                  className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] rounded-lg flex flex-col gap-4 p-4 mb-6 w-full flex-shrink-0"
                >
                  <div className="flex flex-row justify-between w-full gap-7">
                    <div className="flex flex-col gap-2 text-nowrap">
                      <h3 className={`text-base font-semibold leading-none ${order.status === 'new' ? 'text-[#F64831]' : 'text-black'}`}>
                        Заказ №{order.order_hex_id}
                      </h3>
                      <div className="flex flex-row items-center justify-between text-[#1f1f1f] text-xs font-normal leading-none">
                        <p>
                          {new Date(order.ordered_at)
                            .toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })
                            .replace('.', '') +
                            ' ' +
                            new Date(order.ordered_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {order.status === 'delivered' && order.delivery_time_minutes !== null && (
                          <div className="flex flex-row gap-1.5 items-center text-[#BBBBBB]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 7 9"
                              className="w-2 h-2 fill-[#BBBBBB]"
                            >
                              <path d="M5.9883 3.3285a2.5168 2.5168 0 0 0-.712-1.5222A2.4947 2.4947 0 0 0 3.5 1.0623c-.6704 0-1.3091.2701-1.7764.744A2.5175 2.5175 0 0 0 1 3.5733l.0068.1806c.0712.9002.6613 1.7959 1.3477 2.5307.3543.3793.7111.6901.9795.9068.0597.0483.1164.0894.166.1277.0496-.0383.1063-.0794.166-.1277.2684-.2167.6252-.5275.9795-.9068C5.3777 5.5008 6 4.5336 6 3.5733l-.0117-.2448Zm1.002.5063C6.8911 5.132 6.0743 6.262 5.3544 7.0327c-.3956.4235-.7889.7679-1.083 1.0054a9.5906 9.5906 0 0 1-.462.3507c-.0122.0086-.0223.015-.0292.0197l-.0078.0052-.003.0021-.001.001a.4749.4749 0 0 1-.4736.0364l-.0635-.0364-.001-.001-.0029-.002c-.002-.0014-.0046-.003-.0078-.0053-.0069-.0047-.017-.0111-.0293-.0197a9.5906 9.5906 0 0 1-.462-.3507c-.294-.2375-.6873-.582-1.0829-1.0054C.9256 6.262.1088 5.1319.0098 3.8348L0 3.5734c.0001-.9558.3748-1.8669 1.0332-2.5349C1.6912.3712 2.5791 0 3.5 0c.921 0 1.8088.3713 2.4668 1.0386.6585.668 1.0331 1.5791 1.0332 2.5349l-.0098.2614Z" />
                              <path d="M4 3.5733c-.0003-.2436-.2019-.4825-.5-.4825-.2981 0-.4997.239-.5.4825 0 .2437.2017.4835.5.4835s.5-.2398.5-.4835Zm1 0c0 .8765-.6937 1.546-1.5 1.546-.8062 0-1.5-.6695-1.5-1.546.0002-.8763.6939-1.545 1.5-1.545s1.4997.6687 1.5 1.545Z" />
                            </svg>
                            <p className="text-xs font-normal leading-none">{order.delivery_time_minutes} мин</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end text-nowrap">
                      <p className="text-black text-[1.75rem] font-semibold leading-none">{order.total_amount} ₽</p>
                      <p className={`text-xs font-medium leading-none ${order.status === 'new' ? 'text-[#F64831]' : 'text-black'}`}>
                        {order.status_text}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-[#BBBBBB] leading-none font-medium">Адрес:</p>
                    <p className="text-xs text-[#1f1f1f] leading-none font-normal">{order.delivery_address}</p>
                    {order.comment && (
                      <div className="bg-[#F0F0F0] p-3 rounded-lg">
                        <p className="text-xs text-[#1f1f1f] leading-none font-normal text-wrap">{order.comment}</p>
                      </div>
                    )}
                  </div>
                  {order.status !== 'delivered' && (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-[#BBBBBB] leading-none font-medium">Состав:</p>
                      <ul className="flex flex-col gap-3 w-full">
                        {order.items.map((item, itemIndex) => (
                          <li
                            key={item.id || itemIndex}
                            className="flex flex-row gap-2 justify-between items-end"
                          >
                            <span className="w-0.75 h-0.75 bg-black rounded-full self-center flex-shrink-0"></span>
                            <p className="text-xs text-[#1f1f1f] leading-none font-medium text-nowrap">
                              {item.product_name}
                            </p>
                            <span className="flex-grow border-b border-dashed border-[#BBBBBB] mx-1"></span>
                            <p className="text-xs text-black leading-none font-medium text-nowrap flex-shrink-0">
                              {item.price_at_order} ₽
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {order.status !== 'delivered' && (
                    <div className="flex flex-col gap-3">
                      <div className="flex h-1 w-full gap-1 flex-row">
                        {[...Array(4)].map((_, index) => {
                          const progressLevels = {
                            new: 0,
                            preparing: 0.25,
                            delivering: 0.75,
                            delivered: 1,
                            cancelled: 0,
                          };
                          const currentProgress = progressLevels[order.status] || 0;
                          const stepProgress = (index + 1) / 4;
                          return (
                            <div
                              key={index}
                              className={`w-1/4 h-full rounded-full ${
                                stepProgress <= currentProgress ? 'bg-[#F64831]' : 'bg-[#BBBBBB]'
                              }`}
                            ></div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-[#1f1f1f] leading-none font-medium">{order.status_text}</p>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <p className="text-center text-[#BBBBBB] text-base font-medium py-8">
                У вас пока нет заказов.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModalContent;