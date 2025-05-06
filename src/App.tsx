import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import DeliveryPage from './pages/DeliveryPage';
import PromotionsPage from './pages/PromotionsPage';
import Modal from './components/Modal';
import Header from './components/Header';
import Footer from './components/Footer';
import CartModalContent from './components/CartModalContent';
import ProfileModalContent from './components/ProfileModalContent';
import ContactsModalContent from './components/ContactsModalContent';
import PrivacyPolicyModalContent from './components/PrivacyPolicyModalContent';
import AuthPromptModalContent from './components/AuthPromptModalContent';
import './App.css';

type ModalContentType = 'cart' | 'profile' | 'contacts' | 'privacy' | 'auth' | null;

{/*а тут мы все подгружаем и устанавливаем глобальную логику для сервера (запросов), попапов (модальных окон) и открытия разных псевдо-страниц (react - SPA, но технически страницы есть страницы) */}
function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [modalContent, setModalContent] = useState<ModalContentType>(null);
  const isModalOpen = modalContent !== null;
  const closeModal = () => setModalContent(null);

  const openCartModal = () => {
    if (isLoading) return;
    if (isAuthenticated) {
      setModalContent('cart');
    } else {
      setModalContent('auth');
    }
  };

  const openProfileModal = () => {
    if (isLoading) return;
    if (isAuthenticated) {
      setModalContent('profile');
    } else {
      setModalContent('auth');
    }
  };

  const openContactsModal = () => setModalContent('contacts');
  const openPrivacyModal = () => setModalContent('privacy');
  const handleOpenAuthModal = () => {
    if (isLoading) return;
    setModalContent('auth');
  };

  const handleAddToCart = async (productId: number) => {
    console.log('Попытка добавить товар в корзину, ID:', productId);
    if (isLoading) {
      console.log('Идет загрузка статуса авторизации, отмена добавления.');
      return;
    }
    if (!isAuthenticated) {
      console.log('Пользователь не авторизован, открываю модалку авторизации.');
      handleOpenAuthModal();
      return;
    }
    try {
      const response = await fetch('/api/user/cart/add.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        console.log('Товар успешно добавлен в корзину:', result.message);
      } else {
        console.error('Ошибка при добавлении в корзину:', result.error);
        console.log(result.error || 'Произошла ошибка при добавлении товара.');
      }
    } catch (err) {
      console.error('Ошибка запроса добавления в корзину:', err);
      console.log('Произошла ошибка сети при добавлении товара.');
    }
  };

  let contentToRender = null;
  switch (modalContent) {
    case 'cart':
      contentToRender = <CartModalContent onClose={closeModal} />;
      break;
    case 'profile':
      contentToRender = <ProfileModalContent onClose={closeModal} />;
      break;
    case 'contacts':
      contentToRender = <ContactsModalContent onClose={closeModal} />;
      break;
    case 'privacy':
      contentToRender = <PrivacyPolicyModalContent onClose={closeModal} />;
      break;
    case 'auth':
      contentToRender = <AuthPromptModalContent onClose={closeModal} />;
      break;
    default:
      contentToRender = null;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <p className="text-[#BBBBBB] text-lg">Загрузка приложения...</p>
      </div>
    );
  }

  return (
    <>
      <Header onOpenCart={openCartModal} onOpenProfile={openProfileModal} />
      <div className="page-content-wrapper">
        <Routes>
          <Route
            path="/"
            element={<HomePage onAddToCart={handleAddToCart} onOpenAuthModal={handleOpenAuthModal} />}
          />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
        </Routes>
      </div>
      <Footer onOpenContactsModal={openContactsModal} onOpenPrivacyPolicyModal={openPrivacyModal} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>{contentToRender}</Modal>
    </>
  );
}

export default App;