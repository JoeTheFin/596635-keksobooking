'use strict'

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

var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var divMapPins = document.querySelector('.map__pins');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var mapFiltersContainer = document.querySelector('.map__filters-container');

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var createArrayFromRandomParts = function (arr) { //вопрос с этой функцией
  var arrayExample = [];
  for (var i = 0; i < arr.length; i++) {
    if (Math.random() > 0.5) {
      arrayExample[i];
    } else {
        arrayExample;
      }
  }
  return arrayExample;
};

var getExampleArray = function (number) {
  var array =[];
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
        photos: PHOTOS_ARRAY.sort(function(){return Math.random() - 0.5})
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  }
};

// что это за функция? (клонирование метки и заполнение данных метки)
var renderMapPin = function (array) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = (array[i].location.x + pinElement.width / 2) + 'px';
  pinElement.style.top = (array[i].location.y + pinElement.height) + 'px';
  pinElement.src = array[i].author.avatar;
  pinElement.alt = array[i].offer.title;

  return pinElement;
};

var iterateMapPin = function (array) {
  var mapFragment = Document.createDocumentFragment();

  for (var j = 0; j < array.length - 1; j++) {
    var resultMap = renderMapPin(array[i]);
    mapFragment.appendChild(resultMap);
  }

  divMapPins.appendChild(mapFragment);
}

var drawDetailInfo = function (array) {
  var cardElement = cardTemplate.cloneNode(true); // клонировать шаблон в элемент
  var cardFragment = Document.createDocumentFragment(); // создать фрагмент

  var renderCardElement = function (array) {
    cardElement.document.querySelector('.popup__title') = array[i].offer.title;
    cardElement.document.querySelector('.popup__text--address') = array[i].offer.address;
    cardElement.document.querySelector('.popup__text--price') = array[i].offer.price + '₽/ночь';
    cardElement.document.querySelector('.popup__type') = array[i].offer.type;
    if (array[i].offer.type === 'flat') {
      cardElement.textContent = 'Квартира';
    } else if (array[i].offer.type === 'bungalo') {
      cardElement.textContent = 'Бунгало';
    } else if (array[i].offer.type === 'house') {
      cardElement.textContent = 'Дом';
    } else if (array[i].offer.type === 'palace') {
      cardElement.textContent = 'Дворец';
    }
    cardElement.document.querySelector('.popup__text--capacity') = array[i].offer.rooms + 'комнаты для' + array[i].offer.guests + 'гостей';
    cardElement.document.querySelector('.popup__text--time') = 'Заезд после' + array[i].offer.checkin + ', выезд до ' + array[i].offer.checkout;
    cardElement.document.querySelector('.popup__features') = array[i].offer.features;
    cardElement.document.querySelector('.popup__description') = array[i].offer.description;
    cardElement.document.querySelector('.popup__photos') = array[i].offer.photos; //вывести все фото... это как?
  };

  for (var l = 0; l < array.length - 1; l++) {
    var resultCard = renderCardElement(array[i]);
    cardFragment.appendChild(resultCard);
  };

  map.remove(cardFragment, mapFiltersContainer);
  map.insertBefore(cardFragment, mapFiltersContainer);

  // добавляем свойства все в элемент, всё, включая его добавляем во фрагмент
  // очистить содержимое контейнера
  // фрагмент вставляем в контейнер
}

var exampleArray = getExampleArray(8);
iterateMapPin(exampleArray);

map.classList.remove('map--faded');
