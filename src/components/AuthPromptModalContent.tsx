import React, { useState } from 'react';
import '../App.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

type AuthModalView = 'prompt' | 'login' | 'register';

interface AuthPromptModalContentProps {
  onClose: () => void;
}

const AuthPromptModalContent: React.FC<AuthPromptModalContentProps> = ({ onClose }) => {
  const [currentView, setCurrentView] = useState<AuthModalView>('prompt');

  const switchToLogin = () => setCurrentView('login');
  const switchToRegister = () => setCurrentView('register');

  let contentToRender = null;

  switch (currentView) {
    case 'prompt':
      contentToRender = (
        <div className="flex flex-col gap-6 items-center text-center w-full px-4 py-8">
          <h2 className="text-2xl font-semibold leading-none text-[#1f1f1f] tracking-[-0.04em] mb-4">
            Вход или регистрация
          </h2>
          <p className="text-[#1f1f1f] text-base font-normal leading-relaxed mb-6">
            Для доступа к профилю и корзине необходимо войти в аккаунт или зарегистрироваться.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={switchToLogin}
              className="w-full sm:w-auto px-12 py-3 bg-[#F64831] text-white leading-none text-base font-semibold rounded-full text-center hover:bg-[#E53720] transition-colors duration-200"
            >
              Вход
            </button>
            <button
              onClick={switchToRegister}
              className="w-full sm:w-auto px-12 py-3 bg-white border border-[#F64831] text-[#F64831] leading-none text-base font-semibold rounded-full text-center hover:bg-[#F64831] hover:text-white transition-colors duration-200"
            >
              Регистрация
            </button>
          </div>
        </div>
      );
      break;

    case 'login':
      contentToRender = <LoginForm onClose={onClose} onSwitchToRegister={switchToRegister} />;
      break;

    case 'register':
      contentToRender = <RegisterForm onClose={onClose} onSwitchToLogin={switchToLogin} />;
      break;

    default:
      contentToRender = null;
  }

  return <>{contentToRender}</>;
};

export default AuthPromptModalContent;