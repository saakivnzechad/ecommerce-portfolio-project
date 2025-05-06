import React from 'react';
import '../App.css';

interface ContactsModalContentProps {
  onClose: () => void;
}

const ContactsModalContent: React.FC<ContactsModalContentProps> = () => {
  const phoneNumber = '+7 123 456-78-90';
  const email = 'info@risamnogo.ru';
  const address = '__пусть будет москва__';
  const openingHours = 'Ежедневно, 10:00 – 22:00';

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-semibold leading-none text-[#1f1f1f] tracking-[-0.04em]">Контакты</h2>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <p className="text-xs text-[#BBBBBB] leading-none font-medium">Телефон</p>
          <a
            href={`tel:${phoneNumber.replace(/\s|\(|\)|-/g, '')}`}
            className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal hover:underline transition-colors duration-200"
          >
            {phoneNumber}
          </a>
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-xs text-[#BBBBBB] leading-none font-medium">Email</p>
          <a
            href={`mailto:${email}`}
            className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal hover:underline transition-colors duration-200"
          >
            {email}
          </a>
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-xs text-[#BBBBBB] leading-none font-medium">Адрес</p>
          <p className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal">{address}</p>
        </div>
        <div className="w-full flex flex-col gap-2">
          <p className="text-xs text-[#BBBBBB] leading-none font-medium">Время работы</p>
          <p className="w-full px-4 py-3 bg-[#F0F0F0] rounded-full text-sm text-[#1f1f1f] leading-none font-normal">{openingHours}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactsModalContent;