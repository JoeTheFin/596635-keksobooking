'use strict';

(function () {
  var map = document.querySelector('.map');
  var filtersContainer = document.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector('#card');
  var cardTemplateItem = cardTemplate.content.querySelector('.map__card');

  window.card = {
    renderCardElement: function (mapArray) {
      var cardElement = cardTemplateItem.cloneNode(true);

      cardElement.querySelector('.popup__title').textContent = mapArray.offer.title;
      cardElement.querySelector('.popup__text--address').textContent = mapArray.offer.address;
      cardElement.querySelector('.popup__text--price').textContent = mapArray.offer.price + '₽/ночь';

      var typeCard = cardElement.querySelector('.popup__type');
      switch (mapArray.offer.type) {
        case 'flat' :
          typeCard.textContent = 'Квартира';
          break;
        case 'bungalo' :
          typeCard.textContent = 'Бунгало';
          break;
        case 'house' :
          typeCard.textContent = 'Дом';
          break;
        case 'palace' :
          typeCard.textContent = 'Дворец';
          break;
      }

      cardElement.querySelector('.popup__text--capacity').textContent =
      mapArray.offer.rooms + ' комнаты для ' + mapArray.offer.guests + ' гостей';

      cardElement.querySelector('.popup__text--time').textContent =
      'Заезд после ' + mapArray.offer.checkin + ', выезд до ' + mapArray.offer.checkout;

      var featuresCard = cardElement.querySelector('.popup__features');
      featuresCard.innerHTML = '';
      var fragmentFeaturesCard = document.createDocumentFragment();
      for (var i = 0; i < mapArray.offer.features.length; i++) {
        if (mapArray.offer.features.length.length === 0) {
          featuresCard.removeChild(fragmentFeaturesCard);
        } else {
          var featuresElement = document.createElement('li');
          featuresElement.classList = 'popup__feature popup__feature--' + mapArray.offer.features[i];
          fragmentFeaturesCard.appendChild(featuresElement);
        }
      }
      featuresCard.appendChild(fragmentFeaturesCard);

      cardElement.querySelector('.popup__description').textContent = mapArray.offer.description;
      if (mapArray.offer.description.length === 0) {
        cardElement.removeChild(cardElement.querySelector('.popup__description'));
      } else {
        cardElement.querySelector('.popup__description').textContent = mapArray.offer.description;
      }

      var photosCard = cardElement.querySelector('.popup__photos');
      photosCard.innerHTML = '';
      var fragmentPhotosCard = document.createDocumentFragment();
      for (var j = 0; j < mapArray.offer.photos.length; j++) {
        if (mapArray.offer.photos.length === 0) {
          photosCard.removeChild(fragmentPhotosCard);
        } else {
          var photosElement = document.createElement('img');
          photosElement.src = mapArray.offer.photos[j];
          photosElement.width = 45;
          photosElement.height = 40;
          fragmentPhotosCard.appendChild(photosElement);
        }
      }
      photosCard.appendChild(fragmentPhotosCard);

      var avatarCard = cardElement.querySelector('.popup__avatar');
      avatarCard.src = mapArray.author.avatar;

      return cardElement;
    },

    createCardFragment: function (mapArray) {
      var cardFragment = document.createDocumentFragment();
      var resultCard = window.card.renderCardElement(mapArray);
      cardFragment.appendChild(resultCard);
      map.insertBefore(cardFragment, filtersContainer);
      return cardFragment;
    }
  };
})();
