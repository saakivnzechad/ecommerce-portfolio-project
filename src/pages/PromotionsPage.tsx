import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

interface Promotion {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  details: string[];
  showMenuButton: boolean;
}

const promotions: Promotion[] = [
  {
    id: 'weekday-discount',
    imageUrl: '/images/promo_images/promo1.webp',
    title: 'Вечерняя скидка в будни!',
    description: 'Получите выгоду при заказе в определенное время по будням.',
    details: [
      'Действует с понедельника по четверг.',
      'Скидка 15% применяется автоматически к итогу корзины.',
      'Предложение активно с 20:00 до 23:00 по местному времени.',
      'Распространяется на весь ассортимент меню.',
      'Не суммируется с другими акциями и спецпредложениями.',
    ],
    showMenuButton: true,
  },
  {
    id: 'may-discount',
    imageUrl: '/images/promo_images/promo2.webp',
    title: 'Майские скидки!',
    description: 'Выгодные цены на все меню до конца весны!',
    details: [
      'Скидка 10% на все блюда и напитки.',
      'Акция действует по 31 мая 2025 года включительно.',
      'Скидка применяется к итогу корзины.',
      'Не суммируется с другими акциями (кроме тех, где это явно указано).',
    ],
    showMenuButton: true,
  },
  {
    id: 'lunch-discount',
    imageUrl: '/images/promo_images/promo3.webp',
    title: 'Сытный обед с выгодой!',
    description: 'Специальное предложение на сеты и WOK в обеденное время.',
    details: [
      'Акция действует с понедельника по пятницу.',
      'Скидка 20% на все сеты и WOK блюда.',
      'Предложение активно с 12:00 до 15:00.',
      'Не распространяется на другие категории меню (суши, роллы по отдельности, супы, закуски и т.д.).',
      'Не суммируется с другими скидками и акциями.',
    ],
    showMenuButton: true,
  },
];

const PromotionsPage: React.FC = () => {
  return (
    <div className="App">
      <main className="container mx-auto px-4 py-8 md:py-12 lg:py-16 flex flex-col gap-y-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1f1f1f] leading-tight tracking-[-0.04em] text-center">
          Наши актуальные акции!
        </h1>
        {promotions.length > 0 ? (
          <div className="flex flex-col gap-y-16">
            {promotions.map(promotion => (
              <section
                key={promotion.id}
                id={promotion.id}
                className="flex flex-col md:flex-row gap-8 p-6 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
              >
                <div className="w-full md:w-2/5 lg:w-1/3 flex-shrink-0">
                  <img
                    src={promotion.imageUrl}
                    alt={promotion.title}
                    loading="lazy"
                    className="w-full h-auto rounded-lg object-cover aspect-[16/5] md:aspect-[5/4]"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
                <div className="flex-grow flex flex-col gap-y-4">
                  <h2 className="text-[1.75rem] font-semibold leading-snug text-[#F64831] tracking-[-0.04em]">
                    {promotion.title}
                  </h2>
                  <p className="text-base text-[#1f1f1f] leading-relaxed font-semibold">{promotion.description}</p>
                  <div className="text-sm text-[#1f1f1f] leading-relaxed flex flex-col gap-y-2">
                    <p className="font-medium">Условия акции:</p>
                    <ul className="list-disc list-inside pl-4 flex flex-col gap-y-1 marker:text-[#F64831]">
                      {promotion.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                  {promotion.showMenuButton && (
                    <Link
                      to="/#menu"
                      className="mt-4 self-start px-8 py-3 bg-[#F64831] text-white leading-none text-sm font-semibold rounded-lg text-center hover:bg-[#E53720] transition-colors duration-200 inline-block"
                    >
                      Перейти к меню
                    </Link>
                  )}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl text-[#BBBBBB] py-16">
            На данный момент активных акций нет, но скоро обязательно появятся новые!
          </p>
        )}
      </main>
    </div>
  );
};

export default PromotionsPage;