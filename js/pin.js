'use strict';

(function () {
  var map = document.querySelector('.map');
  var pinTemplate = document.querySelector('#pin');
  var pinTemplateItem = pinTemplate.content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var mapFilters = map.querySelector('.map__filters');
  var mapFiltersChild = mapFilters.children;
  var houseType = mapFilters.querySelector('#housing-type');
  var housePrice = mapFilters.querySelector('#housing-price');
  var houseRooms = mapFilters.querySelector('#housing-rooms');
  var houseGuests = mapFilters.querySelector('#housing-guests');
  var houseFeatures = mapFilters.querySelector('#housing-features');

  var HOUSING_PRICE = {
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
  var MAX_PINS_ON_MAP = 5;

  window.pin = {
    createPinFragment: function (mapArray) {
      var pinFragment = document.createDocumentFragment();

      var maxPins = mapArray.length > MAX_PINS_ON_MAP ? MAX_PINS_ON_MAP : mapArray.length;
      for (var i = 0; i < maxPins; i++) {
        if ('offer' in mapArray[i]) {
          var pinElement = pinTemplateItem.cloneNode(true);
          var pinElementImage = pinElement.querySelector('img');

          pinElement.style.left = mapArray[i].location.x + window.util.PIN_WIDTH / 2 + 'px';
          pinElement.style.top = mapArray[i].location.y + window.util.PIN_HEIGHT + 'px';
          pinElementImage.src = mapArray[i].author.avatar;
          pinElementImage.alt = mapArray[i].offer.title;

          pinFragment.appendChild(pinElement);

          window.map.addHandlerToPinClick(pinElement, mapArray[i]);
        }
      }
      mapPins.appendChild(pinFragment);

      mapFilters.addEventListener('change', window.pin.filterPins);
    },

    filterPins: window.debounce(function () {
      window.map.removeChild();
      window.map.removePins();

      for (var i = 0; i < mapFiltersChild.length; i++) {
        switch (mapFiltersChild[i]) {

          case houseType:
            var filteredArray = window.map.mapArray.filter(function (item) {
              if (houseType.value === 'any') {
                return true;
              }
              return item.offer.type === houseType.value;
            });
            break;

          case housePrice:
            filteredArray = filteredArray.filter(function (item) {
              switch (housePrice.value) {
                case 'low':
                  return item.offer.price < HOUSING_PRICE.low.maxPrice;
                case 'middle':
                  return item.offer.price >= HOUSING_PRICE.middle.minPrice
                  && item.offer.price < HOUSING_PRICE.middle.maxPrice;
                case 'high':
                  return item.offer.price >= HOUSING_PRICE.high.minPrice;
                default:
                  return true;
              }
            });
            break;

          case houseRooms:
            filteredArray = filteredArray.filter(function (item) {
              if (houseRooms.value === 'any') {
                return true;
              }
              return item.offer.rooms === parseInt(houseRooms.value, 10);
            });
            break;

          case houseGuests:
            filteredArray = filteredArray.filter(function (item) {
              if (houseGuests.value === 'any') {
                return true;
              }
              return item.offer.guests === parseInt(houseGuests.value, 10);
            });
            break;

          case houseFeatures:
            var checkedInputs = houseFeatures.querySelectorAll('input:checked');
            filteredArray = filteredArray.filter(function (item) {
              var follow = 0;
              for (var j = 0; j < checkedInputs.length; j++) {
                if (item.offer.features.indexOf(checkedInputs[j].value) > -1) {
                  follow++;
                }
              }
              return follow === checkedInputs.length;
            });
            break;
        }
      }
      window.pin.createPinFragment(filteredArray);
    })};
})();
