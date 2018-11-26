'use strict';

var TITLE_ARRAY = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPE_ARRAY = [
  'flat',
  'palace',
  'house',
  'bungalo'
];

var CHECK_ARRAY = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES_ARRAY = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PHOTOS_ARRAY = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var numberPins = 8;

var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var divMapPins = document.querySelector('.map__pins');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var filtersContainer = document.querySelector('.map__filters-container');

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var createArrayFromRandomParts = function (arr) {
  var arrayExample = [];
  for (var i = 0; i < arr.length; i++) {
    if (Math.random() > 0.5) {
      arrayExample.push([i]);
    } else {
      arrayExample = [];
    }
  }
  return arrayExample;
};

var getExampleArray = function (number) {
  var array = [];
  for (var i = 1; i <= number; i++) {
    var locationX = getRandomInt(130, 631);
    var locationY = getRandomInt(130, 631);
    array[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: TITLE_ARRAY[i],
        address: locationX + ', ' + locationY,
        price: getRandomInt(1000, 1000001),
        type: TYPE_ARRAY[getRandomInt(0, TYPE_ARRAY.length)],
        rooms: getRandomInt(1, 6),
        guests: getRandomInt(1, 10),
        checkin: CHECK_ARRAY[getRandomInt(0, CHECK_ARRAY.length)],
        checkout: CHECK_ARRAY[getRandomInt(0, CHECK_ARRAY.length)],
        features: createArrayFromRandomParts(FEATURES_ARRAY),
        description: '',
        photos: PHOTOS_ARRAY.sort(function () {
          return Math.random() - 0.5
          ;
        })
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  }
  return array;
};

// клонирование метки и заполнение данных метки
var renderPinElement = function (array) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = (array.location.x + pinElement.width / 2) + 'px';
  pinElement.style.top = (array.location.y + pinElement.height) + 'px';
  pinElement.src = array.author.avatar;
  pinElement.alt = array.offer.title;

  return pinElement;
};

// создание фрагмента метки и вставка его на страницу
var createPinFragment = function (array) {
  var pinFragment = Document.createDocumentFragment();

  for (var j = 0; j < array.length - 1; j++) {
    var resultMap = renderPinElement(array[j]);
    pinFragment.appendChild(resultMap);
  }

  divMapPins.appendChild(pinFragment);
};

// клонирование шаблона объявления и его заполнение
var renderCardElement = function (array) {
  var cardElement = cardTemplate.cloneNode(true); // клонировать шаблон в элемент

  cardElement.querySelector('.popup__title').textContent = array[0].offer.title;

  cardElement.querySelector('.popup__text--address').textContent = array[0].offer.address;

  cardElement.querySelector('.popup__text--price').textContent = array[0].offer.price + '₽/ночь';

  cardElement.querySelector('.popup__type').textContent = array[0].offer.type;
  if (array[0].offer.type === 'flat') {
    cardElement.textContent = 'Квартира';
  } else if (array[0].offer.type === 'bungalo') {
    cardElement.textContent = 'Бунгало';
  } else if (array[0].offer.type === 'house') {
    cardElement.textContent = 'Дом';
  } else if (array[0].offer.type === 'palace') {
    cardElement.textContent = 'Дворец';
  }

  cardElement.querySelector('.popup__text--capacity').textContent = array[0].offer.rooms + 'комнаты для' + array[0].offer.guests + 'гостей';

  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после' + array[0].offer.checkin + ', выезд до ' + array[0].offer.checkout;

  var featuresCard = cardElement.querySelector('.popup__features'); // цикл вставки всех features
  var fragmentFeaturesCard = document.createDocumentFragment();
  for (var f = 0; f < array[0].offer.features.length; f++) {
    var featuresElement = document.createElement('li');
    fragmentFeaturesCard.appendChild(featuresElement);
  }
  featuresCard.appendChild(fragmentFeaturesCard);

  cardElement.querySelector('.popup__description').textContent = array[0].offer.description;

  var photosCard = cardElement.querySelector('.popup__photos'); // цикл вставки photos
  var fragmentPhotosCard = document.createDocumentFragment();
  for (var p = 0; p < array[0].offer.photos.length; p++) {
    var photosElement = document.createElement('img');
    photosElement.src = array[0].offer.photos;
    fragmentPhotosCard.appendChild(photosElement);
  }
  photosCard.appendChild(fragmentPhotosCard);

  var avatarCard = cardElement.querySelector('.popup__avatar');
  avatarCard.src = array[0].author.avatar;

  return cardElement;
};

// создание фрагмента карточки и вставка её на страницу
var createCardFragment = function (array) {
  var cardFragment = Document.createDocumentFragment();

  for (var r = 0; r < array.length - 1; r++) {
    var resultCard = renderCardElement(array[0]);
    cardFragment.appendChild(resultCard);
  }

  map.empty(cardFragment); // очистить содержимое контейнера
  map.insertBefore(cardFragment, filtersContainer); // фрагмент вставляем в контейнер
};

var exampleArray = getExampleArray(numberPins);
createCardFragment(exampleArray);
createPinFragment(exampleArray);

map.classList.remove('map--faded');
