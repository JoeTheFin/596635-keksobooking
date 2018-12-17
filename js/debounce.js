'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500; // ms
  window.debounce = function (cb) {
    var lastTimeout;

    return function () {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
    };
  };
})();
