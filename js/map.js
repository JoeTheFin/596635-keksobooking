'use strict';

(function () {
  var main = document.querySelector('main');
  var map = main.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapFilters = map.querySelector('.map__filters');
  var mapOverlay = map.querySelector('.map__overlay');

  var adForm = document.querySelector('.ad-form');
  var adFormAddress = adForm.querySelector('#address');
  var adFormRoomNumber = adForm.querySelector('#room_number');
  var adFormTitle = adForm.querySelector('#title');
  var adFormHouseType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimeIn = adForm.querySelector('#timein');
  var adFormTimeOut = adForm.querySelector('#timeout');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormReset = adForm.querySelector('.ad-form__reset');

  var errorTemplate = document.querySelector('#error');
  var errorItem = errorTemplate.content.querySelector('.error');
  var errorItemText = errorItem.querySelector('.error__message');
  var errorItemButton = errorItem.querySelector('.error__button');

  var removeChild = function () {
    if (map.querySelector('.popup')) {
      var popup = map.querySelector('.popup');
      map.removeChild(popup);
      var currentPin = map.querySelector('.map__pin--active');
      currentPin.classList.remove('map__pin--active');
      mapOverlay.removeEventListener('click', removeChild);
      document.removeEventListener('keydown', escapePressedHandler);
    }
  };

  var removePins = function () {
    var mapPinsAll = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < mapPinsAll.length; i++) {
      mapPins.removeChild(mapPinsAll[i]);
    }
  };

  var escapePressedHandler = function (evt) {
    window.util.isEscEvent(evt, removeChild);
  };

  var resetMap = function () {
    removeChild();
    removePins();
    mapPinMain.style.left = '570px';
    mapPinMain.style.top = '375px';
    adForm.classList.add('ad-form--disabled');
    adFormReset.removeEventListener('click', resetMap);
    adForm.reset();
  };

  var addHandlerToPinClick = function (pin, pinData) {
    pin.addEventListener('click', function () {
      mapOverlay.addEventListener('click', removeChild);
      var popup = map.querySelector('.popup');
      var titleAds = pinData.offer.title;
      if (popup) {
        if (popup.querySelector('.popup__title').textContent === titleAds) {
          return;
        }
        removeChild();
        mapOverlay.addEventListener('click', removeChild);
      }

      window.card.createCardFragment(pinData);
      popup = map.querySelector('.popup');
      pin.classList.add('map__pin--active');
      var popupClose = popup.querySelector('.popup__close');
      popupClose.addEventListener('click', removeChild);

      document.addEventListener('keydown', escapePressedHandler);
    });
  };

  var successLoadHandler = function (pinsArray) {
    window.map.mapArray = pinsArray;

    window.pin.createPinFragment(pinsArray);

    window.form.deactivatedForm(adForm, false);
    window.form.deactivatedForm(mapFilters, false);

    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    adFormTitle.addEventListener('change', window.form.checkTitleValue);
    adFormTitle.addEventListener('input', window.form.checkTitleValue);

    adFormHouseType.addEventListener('change', window.form.setPriceValue);
    adFormPrice.addEventListener('input', window.form.checkPriceValue);

    adFormTimeIn.addEventListener('change', window.form.setTimeInOut);
    adFormTimeOut.addEventListener('change', window.form.setTimeInOut);

    adFormRoomNumber.addEventListener('change', window.form.checkCapacity);
    adFormRoomNumber.addEventListener('input', window.form.checkCapacity);

    adFormSubmit.addEventListener('click', window.form.submit);
    adFormReset.addEventListener('click', resetMap);
    adFormReset.addEventListener('click', window.form.reset);
  };

  var errorLoadHandler = function (errorMessage) {
    main.insertBefore(errorItem, main.firstChild);
    errorItemText.textContent = errorMessage;
    errorItemButton.addEventListener('click', getPinsAgain);
    document.addEventListener('click', window.form.removeMessage);
    document.addEventListener('keydown', window.form.messageEscPressHandler);
  };

  var getPinsAgain = function (event) {
    event.stopPropagation();
    errorItemButton.removeEventListener('click', getPinsAgain);
    window.backend.get(successLoadHandler, errorLoadHandler);
  };

  window.form.deactivatedForm(adForm, true);
  window.form.deactivatedForm(mapFilters, true);

  var activatePage = function () {
    window.backend.get(successLoadHandler, errorLoadHandler);
  };

  mapPinMain.addEventListener('mousedown', function (event) {
    event.preventDefault();
    if (map.classList.contains('map--faded')) {
      activatePage();
    }

    var startCoords = {
      x: event.clientX,
      y: event.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mapPinMainY = parseInt(mapPinMain.style.top, 10);
      var mapPinMainX = parseInt(mapPinMain.style.left, 10);

      if (mapPinMainY > window.util.MAX_LOCATION_Y - window.util.PIN_HEIGHT - window.util.MARKER_HEIGHT) {
        mapPinMain.style.top = window.util.MAX_LOCATION_Y - window.util.PIN_HEIGHT - window.util.MARKER_HEIGHT + 'px';
      } else if (mapPinMainY < window.util.MIN_LOCATION_Y - window.util.PIN_HEIGHT - window.util.MARKER_HEIGHT) {
        mapPinMain.style.top = window.util.MIN_LOCATION_Y - window.util.PIN_HEIGHT - window.util.MARKER_HEIGHT + 'px';
      }

      if (mapPinMainX > map.offsetWidth) {
        mapPinMain.style.left = map.offsetWidth - window.util.PIN_WIDTH + 'px';
      } else if (mapPinMainX < 0) {
        mapPinMain.style.left = 0 + 'px';
      }

      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';

    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      adFormAddress.value = window.util.renderLocation(mapPinMain, window.util.PIN_WIDTH / 2, (window.util.PIN_HEIGHT + window.util.MARKER_HEIGHT));

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  window.map = {
    resetMap: resetMap,
    removeChild: removeChild,
    removePins: removePins,
    addHandlerToPinClick: addHandlerToPinClick
  };
})();
