'use strict';

(function () {
  var main = document.querySelector('main');
  var map = main.querySelector('.map');
  var mapOverlay = map.querySelector('.map__overlay');
  var mapFilters = map.querySelector('.map__filters');

  var adForm = main.querySelector('.ad-form');
  var adFormRoomNumber = adForm.querySelector('#room_number');
  var adFormTitle = adForm.querySelector('#title');
  var adFormCapacity = adForm.querySelector('#capacity');
  var adFormHouseType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimeIn = adForm.querySelector('#timein');
  var adFormTimeOut = adForm.querySelector('#timeout');
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormReset = adForm.querySelector('.ad-form__reset');

  var successTemplate = document.querySelector('#success');
  var successItem = successTemplate.content.querySelector('.success');
  var errorTemplate = document.querySelector('#error');
  var errorItem = errorTemplate.content.querySelector('.error');
  var errorItemText = errorItem.querySelector('.error__message');
  var errorItemButton = errorItem.querySelector('.error__button');

  var postFormAgain = function (evt) {
    evt.stopPropagation();
    errorItemButton.removeEventListener('click', postFormAgain);
    window.backend.post(new FormData(adForm), successHandler, errorHandler);
  };

  var successHandler = function () {
    main.insertBefore(successItem, main.firstChild);
    document.addEventListener('click', window.form.removeMessage);
    document.addEventListener('keydown', window.form.onMessageEscPress);
    adFormSubmit.disabled = false;
    window.map.resetMap();
    window.form.reset();
  };

  var errorHandler = function (errorMessage) {
    main.insertBefore(errorItem, main.firstChild);
    errorItemText.textContent = errorMessage;
    errorItemButton.addEventListener('click', postFormAgain);
    document.addEventListener('click', window.form.removeMessage);
    document.addEventListener('keydown', window.form.onMessageEscPress);
    adFormSubmit.disabled = false;
  };

  window.form = {
    onMessageEscPress: function (evt) {
      window.util.isEscEvent(evt, window.form.removeMessage);
    },
    removeMessage: function () {
      switch (main.firstChild.classList.value) {
        case 'success':
          main.removeChild(main.firstChild);
          break;
        case 'error':
          main.removeChild(main.firstChild);
          break;
      }
      mapOverlay.addEventListener('click', window.form.removeMessage);
      document.removeEventListener('click', window.form.removeMessage);
      document.removeEventListener('keydown', window.form.onMessageEscPress);
    },
    submit: function () {
      window.form.checkTitleValue();
      window.form.checkPriceValue();
      window.form.checkCapacity();
      if (adForm.checkValidity()) {
        adFormSubmit.disabled = true;
        window.backend.post(new FormData(adForm), successHandler, errorHandler);
        adForm.reset();
      }
    },
    deactivatedForm: function (form, boolean) {
      for (var i = 0; i < form.children.length; i++) {
        form.children[i].disabled = boolean;
      }
    },
    checkTitleValue: function () {
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
    },
    setPriceValue: function () {
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
      window.form.checkPriceValue();
    },
    checkPriceValue: function () {
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
    },
    setTimeInOut: function (evt) {
      if (evt.target === adFormTimeIn) {
        adFormTimeOut.value = adFormTimeIn.value;
      } else {
        adFormTimeIn.value = adFormTimeOut.value;
      }
    },
    checkCapacity: function () {
      adFormRoomNumber.addEventListener('change', function () {
        var currentVal = adFormRoomNumber.value;
        if (currentVal > adFormCapacity.children.length) {
          for (var i = 0; i < adFormCapacity.children.length; i++) {
            adFormCapacity.children[i].disabled = true;
          }
          adFormCapacity.children[adFormCapacity.children.length - 1].disabled = false;
          adFormCapacity.children[adFormCapacity.children.length - 1].selected = true;
        } else {
          for (var j = 0; j < adFormCapacity.children.length; j++) {
            if (j < currentVal) {
              adFormCapacity.children[j].disabled = false;
            } else {
              adFormCapacity.children[j].disabled = true;
            }
          }
          adFormCapacity.children[0].selected = true;
        }
      });
    },
    reset: function () {
      map.classList.add('map--faded');
      mapFilters.reset();
      adForm.classList.add('ad-form--disabled');
      adForm.reset();
      window.form.deactivatedForm(mapFilters, true);
      window.form.deactivatedForm(adForm, true);
      window.form.setPriceValue();
      window.form.checkCapacity();

      adFormTitle.removeEventListener('change', window.form.checkTitleValue);
      adFormTitle.removeEventListener('input', window.form.checkTitleValue);
      adFormHouseType.removeEventListener('change', window.form.setPriceValue);
      adFormPrice.removeEventListener('input', window.form.checkPriceValue);
      adFormRoomNumber.removeEventListener('change', window.form.checkCapacity);
      adFormCapacity.removeEventListener('change', window.form.checkCapacity);
      adFormTimeIn.removeEventListener('change', window.form.setTimeInOut);
      adFormTimeOut.removeEventListener('change', window.form.setTimeInOut);
      adFormSubmit.removeEventListener('click', window.form.submit);
      adFormReset.removeEventListener('click', window.form.reset);
    }
  };
})();
