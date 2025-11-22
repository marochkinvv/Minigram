import { addLike, deleteLike } from './api.js';
import { openPopup } from './popup.js';

const cardTemplate = document.querySelector('#card-template').content;

export function createCard(cardData, userData, popup) {
  if (!cardTemplate) return;
  const newCard = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImg = newCard.querySelector('.card__image');
  const cardTitle = newCard.querySelector('.card__title');
  const likeButton = newCard.querySelector('.card__like-button');
  const deleteButton = newCard.querySelector('.card__delete-button');

  newCard.setAttribute('data-card-uid', cardData._id);
  let counter = cardData.likes.length < 1 ? 0 : cardData.likes.length;
  likeButton.setAttribute('data-counter', counter);

  if (counter < 1) {
    likeButton.classList.add('card__like-button--no-counter');
  }

  cardImg.src = cardData.link;
  cardTitle.textContent = cardData.name;

  if (typeof userData !== 'undefined') {
    const foundLike = cardData.likes.find((userID) => userData._id === userID._id);
    if (foundLike) {
      likeButton.classList.add('card__like-button_is-active');
    }

    const foundOwner = cardData.owner._id === userData._id;
    if (foundOwner === false) {
      deleteButton.remove();
    } else {
      deleteButton.addEventListener('click', (e) => {
        if (!e.currentTarget) return;
        window.localStorage.setItem('deleted_card', `${cardData._id}`);
        openPopup(popup);
      });
    }
  }

  likeButton.addEventListener('click', (e) => {
    const target = e.currentTarget;
    if (!target) return;
    if (!target.classList.contains('card__like-button_is-active')) {
      addLike(cardData._id)
        .then((cardLikesData) => {
          if (cardLikesData.likes.length > 0 && likeButton.classList.contains('card__like-button--no-counter')) {
            likeButton.classList.remove('card__like-button--no-counter');
          }
          likeButton.setAttribute('data-counter', cardLikesData.likes.length);
          target.classList.add('card__like-button_is-active');
        })
        .catch((err) => {
          console.error('Ошибка при добавлении лайка: ', err);
        });
    } else {
      deleteLike(cardData._id)
        .then((cardLikesData) => {
          if (cardLikesData.likes.length < 1) {
            target.classList.add('card__like-button--no-counter');
          }
          likeButton.setAttribute('data-counter', cardLikesData.likes.length);
          target.classList.remove('card__like-button_is-active');
        })
        .catch((err) => {
          console.error('Ошибка при удалении лайка: ', err);
        });
    }
  });

  return newCard;
}
