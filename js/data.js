'use strict';

(function () {
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

  window.data = {
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    createArrayFromRandomParts: function (arr) {
      var arrayExample = [];
      arrayExample.length = this.getRandomInt(0, arr.length + 1);
      for (var i = 0; i < arrayExample.length; i++) {
        arrayExample[i] = arr[i];
      }
      return arrayExample;
    },
    getExampleArray: function (number) {
      var array = [];
      for (var i = 0; i < number; i++) {
        var locationX = this.getRandomInt(window.util.MIN_LOCATION_Y, window.util.MAX_LOCATION_Y);
        var locationY = this.getRandomInt(window.util.MIN_LOCATION_Y, window.util.MAX_LOCATION_Y);
        array[i] = {
          author: {
            avatar: 'img/avatars/user0' + (i + 1) + '.png'
          },
          offer: {
            title: TITLE_ARRAY[i],
            address: locationX + ', ' + locationY,
            price: this.getRandomInt(MIN_PRICE, MAX_PRICE),
            type: TYPE_ARRAY[this.getRandomInt(0, TYPE_ARRAY.length)],
            rooms: this.getRandomInt(MIN_ROOMS, MAX_ROOMS),
            guests: this.getRandomInt(MIN_GUESTS, MAX_GUESTS),
            checkin: CHECK_ARRAY[this.getRandomInt(0, CHECK_ARRAY.length)],
            checkout: CHECK_ARRAY[this.getRandomInt(0, CHECK_ARRAY.length)],
            features: this.createArrayFromRandomParts(FEATURES_ARRAY),
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
    }
  };
})();
