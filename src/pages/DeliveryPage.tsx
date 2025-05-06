import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

const DeliveryPage: React.FC = () => {
  return (
    <div className="App">
      <main className="container mx-auto px-4 py-8 md:py-12 lg:py-16 flex flex-col gap-y-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1f1f1f] leading-tight tracking-[-0.04em] text-center">
          Информация о доставке
        </h1>
        <section className="flex flex-col gap-y-6 p-6 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-[#F64831] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <h2 className="text-2xl font-semibold leading-none text-[#1f1f1f] tracking-[-0.04em]">
              Зона доставки
            </h2>
          </div>
          <p className="text-base text-[#1f1f1f] leading-relaxed">
            Мы осуществляем быструю и надежную доставку вкуснейших суши, роллов, сетов, WOK и восточных супов по всему{' '}
            <span className="font-semibold text-[#F64831]">Смоленску</span>. Где бы вы ни находились в городе, мы
            постараемся привезти ваш заказ максимально оперативно.
          </p>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section className="flex flex-col gap-y-6 p-6 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-[#F64831] flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <h2 className="text-2xl font-semibold leading-none text-[#1f1f1f] tracking-[-0.04em]">
                Время работы
              </h2>
            </div>
            <div className="w-full px-4 py-3 bg-[#F0F0F0] rounded-lg text-base text-[#1f1f1f] font-medium leading-none">
              Ежедневно: <span className="text-[#F64831] font-semibold">10:00 – 22:00</span>
            </div>
            <p className="text-sm text-[#1f1f1f] leading-relaxed">
              Обратите внимание, время доставки может незначительно варьироваться в зависимости от загруженности кухни,
              дорожной ситуации и удаленности адреса.
            </p>
          </section>
          <section className="flex flex-col gap-y-6 p-6 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-[#F64831] flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <h2 className="text-2xl font-semibold leading-none text-[#1f1f1f] tracking-[-0.04em]">
                Стоимость доставки
              </h2>
            </div>
            <div className="w-full px-4 py-3 bg-[#F0F0F0] rounded-lg flex flex-col gap-y-2 text-base text-[#1f1f1f] font-medium leading-none">
              <p>
                При заказе от <span className="text-black font-semibold">800 ₽</span>:{' '}
                <span className="text-[#F64831] font-semibold">Бесплатно</span>
              </p>
              <p>
                При заказе до <span className="text-black font-semibold">800 ₽</span>:{' '}
                <span className="text-[#1f1f1f] font-medium">150 ₽</span>
              </p>
            </div>
            <p className="text-sm text-[#1f1f1f] leading-relaxed">
              Минимальная сумма заказа для оформления доставки составляет <span className="font-medium">500 ₽</span>.
            </p>
          </section>
        </div>
        <section className="flex flex-col gap-y-6 p-6 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-[#F64831] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h2 className="text-2xl font-semibold leading-none text-[#1f1f1f] tracking-[-0.04em]">
              Как сделать заказ
            </h2>
          </div>
          <div className="w-full px-6 py-4 bg-[#F0F0F0] rounded-lg flex flex-col gap-y-3 text-base text-[#1f1f1f] leading-relaxed">
            <p>Сделать заказ очень просто:</p>
            <ul className="list-decimal list-inside pl-4 flex flex-col gap-y-2 marker:text-[#F64831]">
              <li>
                Выберите любимые блюда в нашем{' '}
                <Link to="/#menu" className="text-[#F64831] hover:underline font-medium">
                  меню
                </Link>
                .
              </li>
              <li>Добавьте их в корзину.</li>
              <li>Перейдите в корзину, заполните детали доставки и выберите способ оплаты.</li>
              <li>Подтвердите заказ, и мы сразу начнем его готовить!</li>
            </ul>
          </div>
          <p className="text-base text-[#1f1f1f] leading-relaxed">
            Если у вас возникли вопросы, свяжитесь с нами по телефону или через форму обратной связи.
          </p>
        </section>
        <section className="flex flex-col items-center gap-y-6 mt-8">
          <h2 className="text-2xl font-semibold leading-none text-[#1f1f1f] tracking-[-0.04em] text-center">
            Готовы заказать?
          </h2>
          <a
            href="/#menu"
            className="px-12 py-4 bg-[#F64831] text-white leading-none text-base font-semibold rounded-full text-center hover:bg-[#E53720] transition-colors duration-200 inline-block"
          >
            Перейти к меню
          </a>
        </section>
      </main>
    </div>
  );
};

export default DeliveryPage;