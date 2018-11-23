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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

function createArrayFromRandomParts(array) {
  var arrayExample = [];
  for (var i = 0; i < array.length; i++) {
    if (Math.random() > 0.5) {
      arrayExample[i]
    } else {
        arrayExample
      }
  }
  return arrayExample;
};

var getExampleArray = function (number) {
  var array = [];
  for (var i = 1; i <= number; i++) {
    var locationX = getRandomInt(130, 631);
    var locationY = getRandomInt(130, 631);
    var object = {
      author: {
        avatar: 'img/avatars/user0' + (i) + '.png'
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

var example = getExampleArray(8);
console.log(example);

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var divMapPins = document.querySelector('.map__pins')

var renderMapPin = function () {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = (object.location.x + 20) + 'px'; //вопрос Денису: как искать атрибут src или style
  pinElement.style.top = (object.location.y + 40) + 'px';
  pinElement.src = object.author.avatar;
  pinElement.alt = object.offer.title;

  return pinElement;
};

var paintMapPin = function () {
  for (var i = 0; i < number; i++) {
    var newPinElement = document.createElement('button');
    divMapPins.appendChild(newPinElement);
  }
}





