import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, Pagination } from 'swiper/modules';
// @ts-expect-error: Swiper CSS import is required but TypeScript cannot resolve it
import 'swiper/css';
// @ts-expect-error: Swiper CSS import is required but TypeScript cannot resolve it
import 'swiper/css/pagination';
import '../App.css';
import { Link } from 'react-router-dom';

//а это просто хиро-секция со слайдером предложений. В будущем акции тоже из бд будут идти (||когда перепишу все на laravel||)

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  const pagination = {
    clickable: true,
    renderBullet: function (_index: number, className: string): string {
      return '<span class="' + className + '"></span>';
    },
  };

  return (
    <Swiper
      keyboard={{ enabled: true }}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      slidesPerView={1}
      pagination={pagination}
      loop={true}
      modules={[Autoplay, Keyboard, Pagination]}
      className="mySwiper"
    >
      <SwiperSlide>
        <Link to="/promotions#weekday-discount">
          <img
            src="/images/promo_images/promo1.webp"
            alt="Промо баннер: Вечерняя скидка в будни!"
            loading="lazy"
            className="w-full aspect-ratio-[16/5] object-cover"
          />
        </Link>
      </SwiperSlide>
      <SwiperSlide>
        <Link to="/promotions#may-discount">
          <img
            src="/images/promo_images/promo2.webp"
            alt="Промо баннер: Майские скидки!"
            loading="lazy"
            className="w-full aspect-ratio-[16/5] object-cover"
          />
        </Link>
      </SwiperSlide>
      <SwiperSlide>
        <Link to="/promotions#lunch-discount">
          <img
            src="/images/promo_images/promo3.webp"
            alt="Промо баннер: Скидка на сеты и WOK в обед!"
            loading="lazy"
            className="w-full aspect-ratio-[16/5] object-cover"
          />
        </Link>
      </SwiperSlide>
    </Swiper>
  );
};