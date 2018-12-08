'use strict';

(function () {
  window.util = {
    MIN_LOCATION_Y: 130,
    MAX_LOCATION_Y: 630,
    PIN_WIDTH: 65,
    PIN_HEIGHT: 65,
    ESC_KEY: 27,
    MARKER_HEIGHT: 15,
    renderLocation: function (pin, width, height) {
      var pinLeftCoordinate = Number.parseInt(pin.style.left, [10]);
      var pinTopCoordinate = Number.parseInt(pin.style.top, [10]);
      var pinCoordinates = (pinLeftCoordinate + Math.floor(width)) + ', ' + (pinTopCoordinate + Math.floor(height));
      return pinCoordinates;
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === this.ESC_KEY) {
        action();
      }
    }
  };
})();
