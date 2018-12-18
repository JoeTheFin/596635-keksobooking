'use strict';

(function () {
  var map = document.querySelector('.map');
  var pinTemplate = document.querySelector('#pin');
  var pinTemplateItem = pinTemplate.content.querySelector('.map__pin');
  var divMapPins = document.querySelector('.map__pins');
  var mapFilters = map.querySelector('.map__filters');
  var mapFiltersFormElements = mapFilters.children;
  var typeSelect = mapFilters.querySelector('#housing-type');
  var priceSelect = mapFilters.querySelector('#housing-price');
  var roomsSelect = mapFilters.querySelector('#housing-rooms');
  var guestsSelect = mapFilters.querySelector('#housing-guests');
  var featuresCheckboxes = document.querySelectorAll('.map__checkbox');

  var HousingPriceValue = {
    low: {
      maxPrice: 10000
    },
    middle: {
      minPrice: 10000,
      maxPrice: 50000
    },
    high: {
      minPrice: 50000
    }
  };

  window.pin = {
    createPinFragment: function (mapArray) {
      var pinFragment = document.createDocumentFragment();

      var maxPins = mapArray.length > 5 ? 5 : mapArray.length;
      for (var i = 0; i < maxPins; i++) {
        if ('offer' in mapArray[i]) {
          var pinElement = pinTemplateItem.cloneNode(true);
          var pinElementImage = pinElement.querySelector('img');

          pinElement.style.left = mapArray[i].location.x + window.util.PIN_WIDTH / 2 + 'px';
          pinElement.style.top = mapArray[i].location.y + window.util.PIN_HEIGHT + 'px';
          pinElementImage.src = mapArray[i].author.avatar;
          pinElementImage.alt = mapArray[i].offer.title;

          pinFragment.appendChild(pinElement);
        }
      }
      divMapPins.appendChild(pinFragment);

      var mapPinsAll = divMapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
      for (i = 0; i < mapPinsAll.length; i++) {
        window.map.onPinClick(mapPinsAll[i], mapArray[i]);
      }
      mapFilters.addEventListener('change', window.pin.filterPins);
    },

    filterPins: window.debounce(function () {
      window.map.removeChild();
      window.map.removePins();

      for (var i = 0; i < mapFiltersFormElements.length; i++) {
        switch (mapFiltersFormElements[i]) {

          case typeSelect:
            var filteredArray = window.map.mapArray.filter(function (item) {
              if (typeSelect.value === 'any') {
                return true;
              } else {
                return item.offer.type === typeSelect.value;
              }
            });
            break;

          case priceSelect:
            filteredArray = filteredArray.filter(function (item) {
              switch (priceSelect.value) {
                case 'low':
                  return item.offer.price < HousingPriceValue.low.maxPrice;
                case 'middle':
                  return item.offer.price >= HousingPriceValue.middle.minPrice
                  && item.offer.price < HousingPriceValue.middle.maxPrice;
                case 'high':
                  return item.offer.price >= HousingPriceValue.high.minPrice;
                default:
                  return true;
              }
            });
            break;

          case roomsSelect:
            filteredArray = filteredArray.filter(function (item) {
              if (roomsSelect.value === 'any') {
                return true;
              } else {
                return item.offer.rooms === parseInt(roomsSelect.value, 10);
              }
            });
            break;

          case guestsSelect:
            filteredArray = filteredArray.filter(function (item) {
              if (guestsSelect.value === 'any') {
                return true;
              } else {
                return item.offer.guests === parseInt(guestsSelect.value, 10);
              }
            });
            break;

          case featuresCheckboxes:
            filteredArray = filteredArray.filter(function (item) {
              for (var f = 0; f < featuresCheckboxes.length; f++) {
                if (featuresCheckboxes[f].checked && item.offer.features.indexOf(featuresCheckboxes[f].value) < 0) {
                  return false;
                }
              }
              return true;
            });
            break;
        }
      }
      window.pin.createPinFragment(filteredArray);
    })};
})();
