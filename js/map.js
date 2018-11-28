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

var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin');
var pinTemplateItem = pinTemplate.content.querySelector('.map__pin');
var divMapPins = document.querySelector('.map__pins');
var cardTemplate = document.querySelector('#card');
var cardTemplateItem = cardTemplate.content.querySelector('.map__card');
var filtersContainer = document.querySelector('.map__filters-container');

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var createArrayFromRandomParts = function (arr) {
  var arrayExample = [];
  arrayExample.length = getRandomInt(0, arr.length + 1);
  for (var i = 0; i < arrayExample.length; i++) {
    arrayExample[i] = arr[i];
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

// клонирование метки и заполнение данных метки
var renderPinElement = function (mapArray) {
  var pinElement = pinTemplateItem.cloneNode(true);
  var pinElementImage = pinElement.querySelector('img');

  pinElement.style.left = (mapArray.location.x + PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (mapArray.location.y + PIN_HEIGHT) + 'px';
  pinElementImage.src = mapArray.author.avatar;
  pinElementImage.alt = mapArray.offer.title;

  return pinElement;
};

// создание фрагмента метки и вставка его на страницу
var createPinFragment = function (mapArray) {
  var pinFragment = document.createDocumentFragment();

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

  var typeCard = cardElement.querySelector('.popup__type');

  switch (mapArray.offer.type) {
    case 'flat' :
      typeCard.textContent = 'Квартира';
      break;
    case 'bungalo' :
      typeCard.textContent = 'Бунгало';
      break;
    case 'house' :
      typeCard.textContent = 'Дом';
      break;
    case 'palace' :
      typeCard.textContent = 'Дворец';
      break;
  }

  cardElement.querySelector('.popup__text--capacity').textContent = mapArray.offer.rooms + ' комнаты для ' + mapArray.offer.guests + ' гостей';

  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + mapArray.offer.checkin + ', выезд до ' + mapArray.offer.checkout;

  var featuresCard = cardElement.querySelector('.popup__features');
  featuresCard.innerHTML = '';
  var fragmentFeaturesCard = document.createDocumentFragment();
  for (var f = 0; f < mapArray.offer.features.length; f++) {
    var featuresElement = document.createElement('li');
    featuresElement.classList = 'popup__feature popup__feature--' + mapArray.offer.features[f]; // без указания класса, он не отрисовывает преимущества на карте
    fragmentFeaturesCard.appendChild(featuresElement);
  }
  featuresCard.appendChild(fragmentFeaturesCard);

  cardElement.querySelector('.popup__description').textContent = mapArray.offer.description;

  var photosCard = cardElement.querySelector('.popup__photos');
  photosCard.innerHTML = '';
  var fragmentPhotosCard = document.createDocumentFragment();
  for (var p = 0; p < mapArray.offer.photos.length; p++) {
    var photosElement = document.createElement('img');
    photosElement.src = mapArray.offer.photos[p];
    photosElement.width = 45;
    photosElement.height = 40;
    fragmentPhotosCard.appendChild(photosElement);
  }
  photosCard.appendChild(fragmentPhotosCard);

  var avatarCard = cardElement.querySelector('.popup__avatar');
  avatarCard.src = mapArray.author.avatar;

  return cardElement;
};

// создание фрагмента карточки и вставка её на страницу
var createCardFragment = function (mapArray) {
  var cardFragment = document.createDocumentFragment();
  var resultCard = renderCardElement(mapArray);
  cardFragment.appendChild(resultCard);
  map.insertBefore(cardFragment, filtersContainer);
  return cardFragment;
};

var createNewMap = getExampleArray(numberPins);

createPinFragment(createNewMap);
createCardFragment(createNewMap[0]);

map.classList.remove('map--faded');
