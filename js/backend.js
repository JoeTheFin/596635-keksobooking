'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var CODE_OK = 200;

  window.backend = {
    get: function (loadHandler, errorHandler) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === CODE_OK) {
          loadHandler(xhr.response);
        } else {
          errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        errorHandler('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000;
      xhr.open('GET', URL + '/data');
      xhr.send();
    },

    post: function (data, loadHandler, errorHandler) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === CODE_OK) {
          loadHandler(xhr.response);
        } else {
          errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        errorHandler('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000;
      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
