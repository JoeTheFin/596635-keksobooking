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

var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_LOCATION = 130;
var MAX_LOCATION = 630;
var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;

var numberPins = 8;

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
  for (var i = 0; i < number; i++) {
    var locationX = getRandomInt(MIN_LOCATION, MAX_LOCATION);
    var locationY = getRandomInt(MIN_LOCATION, MAX_LOCATION);
    array[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: TITLE_ARRAY[i],
        address: locationX + ', ' + locationY,
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
        type: TYPE_ARRAY[getRandomInt(0, TYPE_ARRAY.length)],
        rooms: getRandomInt(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomInt(MIN_GUESTS, MAX_GUESTS),
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

var createNewMap = getExampleArray(numberPins);

var map = document.querySelector('.map');
map.classList.remove('map--faded');
var pinTemplate = document.querySelector('#pin');
var pinTemplateItem = pinTemplate.content.querySelector('.map__pin');
var divMapPins = document.querySelector('.map__pins');
var cardTemplate = document.querySelector('#card');
var cardTemplateItem = cardTemplate.content.querySelector('.map__card');
var filtersContainer = document.querySelector('.map__filters-container');

// клонирование метки и заполнение данных метки
var renderPinElement = function (mapArray) {
  for (var k = 0; k > mapArray.length; k++) {

    var pinElement = pinTemplateItem.cloneNode(true);

    pinElement.style.left = (mapArray[k].location.x + PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (mapArray[k].location.y + PIN_HEIGHT) + 'px';
    pinElement.src = mapArray[k].author.avatar;
    pinElement.alt = mapArray[k].offer.title;
  }
  return pinElement;
};

// создание фрагмента метки и вставка его на страницу
var createPinFragment = function (mapArray) {
  var pinFragment = Document.createDocumentFragment();

  for (var j = 0; j < mapArray.length; j++) {
    var resultMap = renderPinElement(mapArray[j]);
    pinFragment.appendChild(resultMap);
  }

  divMapPins.appendChild(pinFragment);

  return pinFragment;
};

// клонирование шаблона объявления и его заполнение
var renderCardElement = function (mapArray) {
  var cardElement = cardTemplateItem.cloneNode(true); // клонировать шаблон в элемент

  cardElement.querySelector('.popup__title').textContent = mapArray.offer.title;

  cardElement.querySelector('.popup__text--address').textContent = mapArray.offer.address;

  cardElement.querySelector('.popup__text--price').textContent = mapArray.offer.price + '₽/ночь';

  cardElement.querySelector('.popup__type').textContent = mapArray.offer.type;
  if (mapArray.offer.type === 'flat') {
    cardElement.textContent = 'Квартира';
  } else if (mapArray.offer.type === 'bungalo') {
    cardElement.textContent = 'Бунгало';
  } else if (mapArray.offer.type === 'house') {
    cardElement.textContent = 'Дом';
  } else if (mapArray.offer.type === 'palace') {
    cardElement.textContent = 'Дворец';
  }

  cardElement.querySelector('.popup__text--capacity').textContent = mapArray.offer.rooms + ' комнаты для ' + mapArray.offer.guests + ' гостей';

  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после' + mapArray.offer.checkin + ', выезд до ' + mapArray.offer.checkout;

  var featuresCard = cardElement.querySelector('.popup__features'); // цикл вставки всех features
  var fragmentFeaturesCard = document.createDocumentFragment();
  for (var f = 0; f < mapArray.offer.features.length; f++) {
    var featuresElement = document.createElement('li');
    fragmentFeaturesCard.appendChild(featuresElement);
  }
  featuresCard.appendChild(fragmentFeaturesCard);

  cardElement.querySelector('.popup__description').textContent = mapArray.offer.description;

  var photosCard = cardElement.querySelector('.popup__photos'); // цикл вставки photos
  var fragmentPhotosCard = document.createDocumentFragment();
  for (var p = 0; p < mapArray.offer.photos.length; p++) {
    var photosElement = document.createElement('img');
    photosElement.src = mapArray.offer.photos;
    fragmentPhotosCard.appendChild(photosElement);
  }
  photosCard.appendChild(fragmentPhotosCard);

  var avatarCard = cardElement.querySelector('.popup__avatar');
  avatarCard.src = mapArray.author.avatar;

  return cardElement;
};

// создание фрагмента карточки и вставка её на страницу
var createCardFragment = function (mapArray) {
  var cardFragment = Document.createDocumentFragment();

  for (var r = 0; r < mapArray.length; r++) {
    var resultCard = renderCardElement(mapArray[r]);
    cardFragment.appendChild(resultCard);
  }

  map.empty(cardFragment); // очистить содержимое контейнера
  map.insertBefore(cardFragment, filtersContainer); // фрагмент вставляем в контейнер
  return cardFragment;
};

renderPinElement(createNewMap);
renderCardElement(createNewMap[0]);

createPinFragment(createNewMap);
createCardFragment(createNewMap[0]);
