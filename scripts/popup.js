import { clearValidation } from './validate.js';

// Функция открытия попапа
export const openPopup = (popup) => {
  if (!popup) return; // Защита от ошибок
  popup.classList.add('popup_is-opened', 'popup_is-animated');

  // Добавляем слушатели
  closePopupByButton(popup); // Для кнопки закрытия
  closePopupByOverlay(popup); // Для оверлэя
  closePopupByEscape(popup); // Для клавиши Escape
};

// Функция закрытия попапа (теперь она удаляет слушатели)
export const closePopup = (popup) => {
  if (!popup) return;
  clearValidation(popup);
  popup.classList.remove('popup_is-opened');

  // Удаляем слушатели, чтобы избежать утечек
  removePopupListeners(popup);
};

// Функция для кнопки закрытия (добавляется в openPopup)
const closePopupByButton = (popup) => {
  if (!popup) return;
  const buttonClose = popup.querySelector('.popup__close');
  if (buttonClose) {
    buttonClose.addEventListener('click', () => closePopup(popup));
  }
};

// Функция для оверлэя (добавляется в openPopup)
const closePopupByOverlay = (popup) => {
  if (!popup) return;
  // Слушатель на самом popup: проверяем, что клик был на оверлэе (не на контенте)
  popup.addEventListener('mousedown', (e) => {
    if (e.target === popup) {
      // e.target — элемент, на который кликнули; popup — оверлэй
      closePopup(popup);
    }
  });
};

// Функция для Escape (добавляется в openPopup)
const closePopupByEscape = (popup) => {
  if (!popup) return;
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closePopup(popup);
    }
  };
  // Добавляем слушатель на document
  document.addEventListener('keydown', handleEscape);
  // Сохраняем обработчик, чтобы удалить его позже (в removePopupListeners)
  popup._escapeHandler = handleEscape; // Временное свойство на popup для хранения
};

// Вспомогательная функция для удаления слушателей (вызывается в closePopup)
const removePopupListeners = (popup) => {
  if (!popup) return;
  // Удаляем слушатель для Escape (если он был добавлен)
  if (popup._escapeHandler) {
    document.removeEventListener('keydown', popup._escapeHandler);
    delete popup._escapeHandler; // Очищаем
  }
  // Слушатели для кнопки и оверлэя удаляются автоматически, так как popup закрывается,
  // но если нужно, можно добавить явное удаление (например, через dataset или WeakMap).
  // Для простоты оставим так — они не мешают после закрытия.
};
