import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

interface RegisterFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onClose, onSwitchToLogin }) => {
  const { register, error: authContextError } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const displayError = formError || authContextError;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setFormError(null);

    if (!name || !phone || !password) {
      setFormError('Пожалуйста, заполните все обязательные поля (Имя, Телефон, Пароль).');
      setIsLoading(false);
      return;
    }

    const userData = {
      name: name,
      phone: phone,
      email: email || null,
      password: password,
      dob: dob || null,
    };

    const success = await register(userData);
    setIsLoading(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full px-4">
      <h2 className="text-2xl font-semibold leading-none text-[#1f1f1f] tracking-[-0.04em]">
        Регистрация
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <div className="w-full flex flex-col gap-2">
          <p className="text-xs text-[#BBBBBB] leading-none font-medium">Имя</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal placeholder:text-[#BBBBBB]"
            placeholder="Введите ваше имя"
            required
            autoFocus
            disabled={isLoading}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-xs text-[#BBBBBB] leading-none font-medium">Телефон</p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal placeholder:text-[#BBBBBB]"
            placeholder="Введите ваш телефон"
            required
            disabled={isLoading}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-xs text-[#BBBBBB] leading-none font-medium">Email (опционально)</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal placeholder:text-[#BBBBBB]"
            placeholder="Введите ваш Email"
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
            placeholder="Придумайте пароль"
            required
            disabled={isLoading}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-xs text-[#BBBBBB] leading-none font-medium">Дата рождения (опционально)</p>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal placeholder:text-[#BBBBBB]"
            disabled={isLoading}
          />
        </div>
        {displayError && <p className="text-red-500 text-sm text-center">{displayError}</p>}
        <button
          type="submit"
          className="w-full px-12 py-3 mt-4 bg-[#F64831] text-white leading-none text-base font-semibold rounded-full text-center hover:bg-[#E53720] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      <div className="text-center mt-4">
        <p className="text-sm text-[#1f1f1f]">
          Уже есть аккаунт?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#F64831] font-medium hover:underline transition-colors duration-200"
            disabled={isLoading}
          >
            Войти
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;