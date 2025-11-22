import { getCards, getUser, addNewCard, editProfile, editAvatar, deleteCard } from './api.js';
import { createCard } from './card.js';
import { openPopup, closePopup } from './popup.js';
import { enableValidation } from './validate.js';

let cardList = document.querySelector('.places__list');
let userData;
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
const newCardButton = document.querySelector('.profile__add-button');
const newCardModal = document.querySelector('.popup_type_new-card');
const newCardForm = document['new-place'];
const profileEditButton = document.querySelector('.profile__edit-button');
const profileEditModal = document.querySelector('.popup_type_edit');
const profileEditForm = document['edit-profile'];
const editAvatarModal = document.querySelector('.popup_type_avatar');
const editAvatarForm = document['edit-avatar'];
const showCardModal = document.querySelector('.popup_type_image');
const showCardModalImage = document.querySelector('.popup__image');
const showCardModalCaption = document.querySelector('.popup__caption');
const deleteCardModal = document.querySelector('.popup_type_delete');
const deleteCardForm = document['delete-card'];

// дожидаемся резолва всех промисов
const promises = Promise.all([getCards(), getUser()]);

// получаем и обрабатываем данные из промисов
promises
  .then(([cards, user]) => {
    userData = user; // полученные данные пользователя записали в локальную переменную
    profileTitle.textContent = user.name; // отрисовали имя пользователя
    profileDescription.textContent = user.about; // отрисовали описание пользователя
    profileAvatar.style.backgroundImage = `url(${user.avatar})`; // отрисовали аватар пользователя
    if (profileEditForm) {
      const { name, description } = profileEditForm.elements;
      name.value = user.name; // заполнили данные формы редактирования пользователя
      description.value = user.about; // заполнили данные формы редактирования пользователя
    }
    cards.forEach((card) => {
      cardList.append(createCard(card, user, deleteCardModal)); // прошлись циклом по всем полученным карточкам, отрисовали их и положили в ul
    });
  })
  .catch((err) => {
    console.error(`Произошла ошибка: ' ${err}`);
  })
  .finally(() => {
    cardList = document.querySelector('.places__list'); // обновили в переменной данные ul в DOM
  });

// вызываем модалку по клику на кнопку, добавляющую новую карточку
if (newCardButton && newCardModal) {
  newCardButton.addEventListener('click', (e) => {
    let target = e.currentTarget;
    if (!target) return;
    openPopup(newCardModal);
  });
}

// отправка новой карточки на сервер и её отрисовка
if (newCardForm) {
  const { link, place_name, submit } = newCardForm.elements;
  submit.addEventListener('click', (e) => {
    // обрабатываем клик на кнопку "Сохранить"
    e.preventDefault(); // отменяем поведение submit по умолчанию
    submit.textContent = 'Сохранение...'; // заменяем текст кнопки на время обновления данных
    addNewCard(place_name.value, link.value) // получаем и обрабатываем данные из промиса
      .then((card) => {
        cardList.prepend(createCard(card, userData, deleteCardModal)); // отрисовываем новую карточку и вставляем её в начало списка
        link.value = ''; // очищаем поля формы
        place_name.value = ''; // очищаем поля формы
        closePopup(newCardForm.closest('.popup_is-opened')); // закрываем модалку
      })
      .catch((err) => {
        console.error('Произошла ошибка: ', err);
      })
      .finally(() => {
        submit.textContent = 'Сохранить'; // возвращаем текст кнопки, когда завершилось обновление данных
      });
  });
}

if (profileEditButton && profileEditModal && profileEditForm) {
  profileEditButton.addEventListener('click', (e) => {
    let target = e.currentTarget;
    if (!target) return;
    const { name, description } = profileEditForm.elements;
    name.value = userData.name;
    description.value = userData.about;
    openPopup(profileEditModal);
  });
}

if (profileEditForm) {
  const { name, description, submit } = profileEditForm.elements;
  submit.addEventListener('click', (e) => {
    e.preventDefault();
    submit.textContent = 'Сохранение...';
    editProfile(name.value, description.value)
      .then((user) => {
        userData = user;
        profileTitle.textContent = user.name;
        profileDescription.textContent = user.about;
        closePopup(profileEditForm.closest('.popup_is-opened'));
      })
      .catch((err) => {
        console.error('Произошла ошибка: ', err);
      })
      .finally(() => {
        submit.textContent = 'Сохранить';
      });
  });
}

if (profileAvatar && editAvatarModal) {
  profileAvatar.addEventListener('click', (e) => {
    let target = e.currentTarget;
    if (!target) return;
    openPopup(editAvatarModal);
  });
}

if (editAvatarForm) {
  const { link, submit } = editAvatarForm.elements;
  submit.addEventListener('click', (e) => {
    e.preventDefault();
    submit.textContent = 'Сохранение...';
    editAvatar(link.value)
      .then((user) => {
        userData = user;
        profileAvatar.style.backgroundImage = `url(${user.avatar})`;
        link.value = '';
        closePopup(editAvatarForm.closest('.popup_is-opened'));
      })
      .catch((err) => {
        console.error('Произошла ошибка: ', err);
      })
      .finally(() => {
        submit.textContent = 'Сохранить';
      });
  });
}

if (cardList && showCardModal) {
  cardList.addEventListener('click', (e) => {
    e.stopPropagation();
    const target = e.target.closest('.card__image');
    if (!target) return;
    const card = target.parentElement;
    const text = card.querySelector('.card__title');
    showCardModalImage.src = target.src;
    showCardModalCaption.textContent = text.textContent;
    openPopup(showCardModal);
  });
}

if (deleteCardModal && deleteCardForm) {
  const { submit } = deleteCardForm.elements;
  submit.addEventListener('click', (e) => {
    e.preventDefault();
    submit.textContent = 'Удаление...';
    const cardID = window.localStorage.getItem('deleted_card');
    if (!cardID) return;
    deleteCard(cardID)
      .then((card) => {
        document.querySelector(`[data-card-uid="${cardID}"]`).remove();
        window.localStorage.removeItem('deleted_card');
        closePopup(deleteCardModal);
      })
      .catch((err) => {
        console.error('Ошибка при удалении карточки: ', err);
      })
      .finally(() => {
        submit.textContent = 'Да';
      });
  });
}

enableValidation();
