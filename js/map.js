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
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var MIN_LOCATION_X = 0;
var MAX_LOCATION_X = 1150;
var PIN_WIDTH = 65;
var PIN_HEIGHT = 65;
var ESC_KEY = 27;
var MARKER_HEIGHT = 15;

var numberPins = 8;

var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin');
var pinTemplateItem = pinTemplate.content.querySelector('.map__pin');
var divMapPins = document.querySelector('.map__pins');
var cardTemplate = document.querySelector('#card');
var cardTemplateItem = cardTemplate.content.querySelector('.map__card');
var filtersContainer = document.querySelector('.map__filters-container');

var popup = map.querySelector('.popup');
var mapPinMain = document.querySelector('.map__pin--main');
var mapFilters = map.querySelector('.map__filters');
var adForm = document.querySelector('.ad-form');
var adFormAddress = adForm.querySelector('#address');
var adFormRoomNumber = adForm.querySelector('#room_number');
var adFormTitle = adForm.querySelector('#title');
var adCapacity = adForm.querySelector('#capacity');
var adFormHouseType = adForm.querySelector('#type');
var adFormPrice = adForm.querySelector('#price');
var adFormTimeIn = adForm.querySelector('#timein');
var adFormTimeOut = adForm.querySelector('#timeout');
var adFormSubmit = adForm.querySelector('.ad-form__submit');

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
    var locationX = getRandomInt(MIN_LOCATION_Y, MAX_LOCATION_Y);
    var locationY = getRandomInt(MIN_LOCATION_Y, MAX_LOCATION_Y);
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

// создание фрагмента карточки и вставка его на страницу
var createCardFragment = function (mapArray) {
  var cardFragment = document.createDocumentFragment();
  var resultCard = renderCardElement(mapArray);
  cardFragment.appendChild(resultCard);
  map.insertBefore(cardFragment, filtersContainer);
  return cardFragment;
};

var renderLocation = function (pin, width, height) {
  var pinLeftCoordinate = Number.parseInt(pin.style.left, [10]);
  var pinTopCoordinate = Number.parseInt(pin.style.top, [10]);
  var pinCoordinates = (pinLeftCoordinate + Math.floor(width)) + ', ' + (pinTopCoordinate + Math.floor(height));

  return pinCoordinates;
};

var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  deactivatedForm(adForm, false);
  deactivatedForm(mapFilters, false);

  createPinFragment(createAds);

  adFormTitle.addEventListener('change', checkTitleValue);
  adFormTitle.addEventListener('input', checkTitleValue);

  adFormHouseType.addEventListener('change', setPriceValue);
  adFormPrice.addEventListener('input', checkPriceValue);

  adFormTimeIn.addEventListener('change', setTimeInOut);
  adFormTimeOut.addEventListener('change', setTimeInOut);

  adFormSubmit.addEventListener('click', function () { // валидация при отправке формы
    checkTitleValue();
    checkPriceValue();
  });

  adFormAddress.value = renderLocation(mapPinMain, PIN_WIDTH / 2, (PIN_HEIGHT + MARKER_HEIGHT));

  var mapCreatePinsAll = divMapPins.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (var i = 0; i < mapCreatePinsAll.length; i++) {
    onPinClick(mapCreatePinsAll[i], createAds[i]);
  }
};

var removeChild = function () {
  map.removeChild(popup);
  document.removeEventListener('keydown', onPopupCloseKey);
};

var onPopupCloseKey = function (evt) {
  if (evt.keyCode === ESC_KEY) {
    removeChild();
  }
};

var onPinClick = function (allPins, mapArray) {
  allPins.addEventListener('click', function () {
    popup = map.querySelector('.popup');
    var titleAds = mapArray.offer.title;
    if (popup) {
      if (popup.querySelector('.popup__title').textContent === titleAds) {
        return;
      }
      removeChild();
    }

    createCardFragment(mapArray);
    popup = map.querySelector('.popup');
    var popupClose = popup.querySelector('.popup__close');
    popupClose.addEventListener('click', removeChild);

    document.addEventListener('keydown', onPopupCloseKey);
  });
};

var deactivatedForm = function (form, boolean) {
  for (var i = 0; i < form.children.length; i++) {
    form.children[i].disabled = boolean;
  }
};

deactivatedForm(adForm, true);
deactivatedForm(mapFilters, true);

var checkTitleValue = function () {
  if (adFormTitle.validity.valueMissing) {
    var adFormErrorMessage = 'Добавьте заголовок объявления.';
  } else if (adFormTitle.validity.tooShort) {
    adFormErrorMessage = 'Минимальная длина — 30 символов';
  } else if (adFormTitle.validity.tooLong) {
    adFormErrorMessage = 'Максимальная длина — 100 символов';
  } else {
    adFormErrorMessage = '';
  }

  adFormTitle.setCustomValidity(adFormErrorMessage);
};

var setPriceValue = function () {
  switch (adFormHouseType.value) {
    case 'bungalo':
      var minPrice = 0;
      break;
    case 'flat':
      minPrice = 1000;
      break;
    case 'house':
      minPrice = 5000;
      break;
    case 'palace':
      minPrice = 10000;
      break;
  }
  adFormPrice.min = minPrice;
  adFormPrice.placeholder = 'от ' + minPrice;
  checkPriceValue();
};

var checkPriceValue = function () {
  if (adFormPrice.validity.valueMissing) {
    var adFormErrorMessage = 'Укажите цену за ночь.';
  } else if (adFormPrice.validity.rangeUnderflow) {
    adFormErrorMessage = 'Цена за ночь должна быть больше или равна ' + adFormPrice.min + '.';
  } else if (adFormPrice.validity.rangeOverflow) {
    adFormErrorMessage = 'Цена за ночь должна быть меньше или равна ' + adFormPrice.max + '.';
  } else {
    adFormErrorMessage = '';
  }
  adFormPrice.setCustomValidity(adFormErrorMessage);
};

adFormRoomNumber.addEventListener('change', function () {
  var currentVal = adFormRoomNumber.value;
  if (currentVal > adCapacity.children.length) {
    for (var i = 0; i < adCapacity.children.length; i++) {
      adCapacity.children[i].disabled = true;
    }
    adCapacity.children[adCapacity.children.length - 1].disabled = false;
    adCapacity.children[adCapacity.children.length - 1].selected = true;
  } else {
    for (var j = 0; j < adCapacity.children.length; j++) {
      if (j < currentVal) {
        adCapacity.children[j].disabled = false;
      } else {
        adCapacity.children[j].disabled = true;
      }
    }
    adCapacity.children[0].selected = true;
  }
});

var setTimeInOut = function (evt) {
  if (evt.target === adFormTimeIn) {
    adFormTimeOut.value = adFormTimeIn.value;
  } else {
    adFormTimeIn.value = adFormTimeOut.value;
  }
};

var createAds = getExampleArray(numberPins);

mapPinMain.addEventListener('mousedown', function (event) {
  event.preventDefault();
  if (map.classList.contains('map--faded')) { // проверка если карта имеет этот класс
    activatePage();
  }

  var startCoords = {
    x: event.clientX,
    y: event.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var mapPinMainY = Number.parseInt(mapPinMain.style.top, [10]);
    var mapPinMainX = Number.parseInt(mapPinMain.style.left, [10]);

    if (mapPinMainY > MAX_LOCATION_Y - PIN_HEIGHT - MARKER_HEIGHT) {
      mapPinMain.style.top = MAX_LOCATION_Y - PIN_HEIGHT - MARKER_HEIGHT + 'px';
    } else if (mapPinMainY < MIN_LOCATION_Y - PIN_HEIGHT - MARKER_HEIGHT) {
      mapPinMain.style.top = MIN_LOCATION_Y - PIN_HEIGHT - MARKER_HEIGHT + 'px';
    }

    if (mapPinMainX > MAX_LOCATION_X) {
      mapPinMain.style.left = MAX_LOCATION_X - MARKER_HEIGHT + 'px';
    } else if (mapPinMainX < MIN_LOCATION_X) {
      mapPinMain.style.left = MIN_LOCATION_X + 'px';
    }

    mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
    mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';

  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    adFormAddress.value = renderLocation(mapPinMain, PIN_WIDTH / 2, (PIN_HEIGHT + MARKER_HEIGHT));

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
