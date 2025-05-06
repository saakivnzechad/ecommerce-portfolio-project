import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

interface LoginFormProps {
 onClose: () => void;
 onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSwitchToRegister }) => {
 const { login, error: authContextError } = useAuth();
 const [phone, setPhone] = useState('');
 const [password, setPassword] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [formValidationError, setFormValidationError] = useState<string | null>(null);

 const displayError = formValidationError || authContextError;

 const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  setFormValidationError(null);
    // Removed clearAuthError as it does not exist in AuthContextValue
  setIsLoading(true);

  if (!phone || !password) {
   setFormValidationError('Пожалуйста, заполните оба поля.');
   setIsLoading(false);
   return;
  }

  const success = await login({ phone, password });

  setIsLoading(false);

  if (success) {
   onClose();
  }
 };

 return (
  <div className="flex flex-col gap-6 w-full px-4">
   <h2 className="text-2xl font-semibold leading-none text-[#1f1f1f] tracking-[-0.04em]">Вход в аккаунт</h2>
   <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
    <div className="w-full flex flex-col gap-2">
     <p className="text-xs text-[#BBBBBB] leading-none font-medium">Телефон</p>
     <input
      type="tel"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal placeholder:text-[#BBBBBB]"
      placeholder="Введите ваш телефон"
      required
      autoFocus
      disabled={isLoading}
     />
    </div>
    <div className="w-full flex flex-col gap-2">
     <p className="text-xs text-[#BBBBBB] leading-none font-medium">Пароль</p>
     <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal placeholder:text-[#BBBBBB]"
      placeholder="Введите пароль"
      required
      disabled={isLoading}
     />
    </div>
    {displayError && <p className="text-red-500 text-sm text-center">{displayError}</p>}
    <button
     type="submit"
     className="w-full px-12 py-3 mt-4 bg-[#F64831] text-white leading-none text-base font-semibold rounded-full text-center hover:bg-[#E53720] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
     disabled={isLoading}
    >
     {isLoading ? 'Вход...' : 'Войти'}
    </button>
   </form>
   <div className="text-center mt-4">
    <p className="text-sm text-[#1f1f1f]">
     Еще нет аккаунта?{' '}
     <button
      onClick={onSwitchToRegister}
      className="text-[#F64831] font-medium hover:underline transition-colors duration-200"
      disabled={isLoading}
     >
      Зарегистрироваться
     </button>
    </p>
   </div>
  </div>
 );
};

export default LoginForm;