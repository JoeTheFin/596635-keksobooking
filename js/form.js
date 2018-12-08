'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormRoomNumber = adForm.querySelector('#room_number');
  var adFormTitle = adForm.querySelector('#title');
  var adCapacity = adForm.querySelector('#capacity');
  var adFormHouseType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimeIn = adForm.querySelector('#timein');
  var adFormTimeOut = adForm.querySelector('#timeout');

  window.form = {
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
      this.checkPriceValue();
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
    }
  };
})();
