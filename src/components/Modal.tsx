import React, { useRef } from 'react';
import '../App.css';
import { CSSTransition } from 'react-transition-group';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// это генератор (или обертка вернее сказать) для всех модальных окон - суда просто вживляются компоненты с содержимым, будь то регистрация/авторизация, политика исп, лк, корзина, контакты. Тут же кнопочка закрытия и основная логика

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="modal-fade"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div ref={nodeRef} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
        <div className="fixed inset-0" onClick={onClose} aria-hidden="true"></div>
        <div
          className="relative bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.15)] container max-w-3xl max-h-[40rem] z-50 flex flex-col gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-row w-full justify-end items-center">
            <button
              onClick={onClose}
              className="w-6 h-6 text-[#1F1F1F] hover:text-[#F64831] transition-colors duration-200"
              aria-label="Закрыть модальное окно"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="pr-2">{children}</div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Modal;