'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin');
  var pinTemplateItem = pinTemplate.content.querySelector('.map__pin');
  var divMapPins = document.querySelector('.map__pins');
  window.pin = {
    renderPinElement: function (mapArray) {
      var pinElement = pinTemplateItem.cloneNode(true);
      var pinElementImage = pinElement.querySelector('img');

      pinElement.style.left = (mapArray.location.x + window.util.PIN_WIDTH / 2) + 'px';
      pinElement.style.top = (mapArray.location.y + window.util.PIN_HEIGHT) + 'px';
      pinElementImage.src = mapArray.author.avatar;
      pinElementImage.alt = mapArray.offer.title;

      return pinElement;
    },

    createPinFragment: function (mapArray) {
      var pinFragment = document.createDocumentFragment();

      for (var j = 0; j < mapArray.length; j++) {
        var resultMap = this.renderPinElement(mapArray[j]);
        pinFragment.appendChild(resultMap);
      }

      divMapPins.appendChild(pinFragment);

      return pinFragment;
    }
  };
})();
