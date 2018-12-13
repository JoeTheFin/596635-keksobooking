'use strict';

(function () {
  var main = document.querySelector('main');
  var map = main.querySelector('.map');
  var divMapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapFilters = map.querySelector('.map__filters');
  var popup = map.querySelector('.popup');

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
    map.removeChild(popup);
    document.removeEventListener('keydown', onPopupCloseKey);
  };

  var onPopupCloseKey = function (evt) {
    window.util.isEscEvent(evt, removeChild);
  };

  var resetMap = function () {
    if (popup) {
      removeChild();
    }
    map.classList.add('map--faded');
    var mapPinsAll = divMapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < mapPinsAll.length; i++) {
      divMapPins.removeChild(mapPinsAll[i]);
    }
    mapPinMain.style.left = '570px';
    mapPinMain.style.top = '375px';
    adForm.classList.add('ad-form--disabled');
    adForm.reset();
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

      window.card.createCardFragment(mapArray);
      popup = map.querySelector('.popup');
      var popupClose = popup.querySelector('.popup__close');
      popupClose.addEventListener('click', removeChild);

      document.addEventListener('keydown', onPopupCloseKey);
    });
  };

  var successHandler = function (pinsArray) {
    window.pin.createPinFragment(pinsArray);

    var mapCreatePinsAll = divMapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < mapCreatePinsAll.length; i++) {
      onPinClick(mapCreatePinsAll[i], pinsArray[i]);
    }
  };

  var errorHandler = function (errorMessage) {
    main.insertBefore(errorItem, main.firstChild);
    errorItemText.textContent = errorMessage;
    errorItemButton.addEventListener('click', getPinsAgain);
    document.addEventListener('click', window.form.removeMessage);
    document.addEventListener('keydown', window.form.onMessageEscPress);
  };

  var getPinsAgain = function (event) {
    event.stopPropagation();
    errorItemButton.removeEventListener('click', getPinsAgain);
    window.backend.get(successHandler, errorHandler);
  };

  window.form.deactivatedForm(adForm, true);
  window.form.deactivatedForm(mapFilters, true);

  var activatePage = function () {
    window.backend.get(successHandler, errorHandler);

    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    window.form.deactivatedForm(adForm, false);
    window.form.deactivatedForm(mapFilters, false);

    adFormTitle.addEventListener('change', window.form.checkTitleValue);
    adFormTitle.addEventListener('input', window.form.checkTitleValue);

    adFormHouseType.addEventListener('change', window.form.setPriceValue);
    adFormPrice.addEventListener('input', window.form.checkPriceValue);

    adFormTimeIn.addEventListener('change', window.form.setTimeInOut);
    adFormTimeOut.addEventListener('change', window.form.setTimeInOut);

    adFormRoomNumber.addEventListener('change', window.form.checkCapacity);
    adFormRoomNumber.addEventListener('input', window.form.checkCapacity);

    adFormSubmit.addEventListener('click', function () {
      window.form.submit();
      resetMap();
    });

    adFormReset.addEventListener('click', resetMap);
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

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      adFormAddress.value = window.util.renderLocation(mapPinMain, window.util.PIN_WIDTH / 2, (window.util.PIN_HEIGHT + window.util.MARKER_HEIGHT));

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
