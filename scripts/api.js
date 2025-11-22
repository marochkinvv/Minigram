const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-13',
  headers: {
    authorization: '01b9e780-4687-4e3c-a4be-41860ad23bd2',
    'Content-Type': 'application/json',
  },
};

export const getCards = async () => {
  try {
    const res = await fetch(`${config.baseUrl}/cards`, {
      method: 'GET',
      headers: config.headers,
    });
    if (!res.ok) {
      throw new Error(`Ошибка получения данных карточек: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Ошибка получения данных карточек: ${err}`);
    throw err;
  }
};

export const getUser = async () => {
  try {
    const res = await fetch(`${config.baseUrl}/users/me`, {
      method: 'GET',
      headers: config.headers,
    });
    if (!res.ok) {
      throw new Error(`Ошибка получения данных пользователя: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Ошибка получения данных карточек: ${err}`);
    throw err;
  }
};

export const addLike = async (cardID) => {
  try {
    const res = await fetch(`${config.baseUrl}/cards/likes/${cardID}`, {
      method: 'PUT',
      headers: config.headers,
    });
    if (!res.ok) {
      throw new Error(`Ошибка добавления лайка: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Ошибка добавления лайка: ${err}`);
    throw err;
  }
};

export const deleteLike = async (cardID) => {
  try {
    const res = await fetch(`${config.baseUrl}/cards/likes/${cardID}`, {
      method: 'DELETE',
      headers: config.headers,
    });
    if (!res.ok) {
      throw new Error(`Ошибка удаления лайка: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Ошибка удаления лайка: ${err}`);
    throw err;
  }
};

export const addNewCard = async (name, link) => {
  try {
    const res = await fetch(`${config.baseUrl}/cards`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    });
    if (!res.ok) {
      throw new Error(`Ошибка добавления карточки: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Ошибка добавления карточки: ${err}`);
    throw err;
  }
};

export const deleteCard = async (cardID) => {
  try {
    const res = await fetch(`${config.baseUrl}/cards/${cardID}`, {
      method: 'DELETE',
      headers: config.headers,
    });
    if (!res.ok) {
      throw new Error(`Ошибка удаления карточки: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Ошибка удаления карточки: ${err}`);
    throw err;
  }
};

export const editProfile = async (name, about) => {
  try {
    const res = await fetch(`${config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    });
    if (!res.ok) {
      throw new Error(`Ошибка при редактировании пользователя: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Ошибка при редактировании пользователя: ${res.status}`);
    throw err;
  }
};

export const editAvatar = async (url) => {
  try {
    const res = await fetch(`${config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({
        avatar: url,
      }),
    });
    if (!res.ok) {
      throw new Error(`Ошибка при редактировании аватара: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`Ошибка при редактировании аватара: ${res.status}`);
    throw err;
  }
};
