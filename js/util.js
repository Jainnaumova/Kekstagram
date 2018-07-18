'use strict';
(function () {
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
// delete curent DOM
  function removeChildren(comments) {
    while (comments.firstChild) {
      comments.removeChild(comments.firstChild);
    }
  }

  function createTagElement(tagName, className) {
    var element = document.createElement(tagName);
    className.split(' ').forEach(function(cln) {
      element.classList.add(cln);
    });
    return element;
  }

  function getRandomIndex(number) {
    return Math.floor(number * Math.random());
  }

  function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomArrayElement(array) {
    var initIndex = array.length;
    return array[getRandomIndex(initIndex)];
  }

  function getShuffle(array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  function checkFocusOnElement(className) {
    return document.querySelector(className) === document.activeElement;
  }

  function closePopup(popup) {
    popup.classList.add('hidden');
  }

  window.util = {
    KEYCODE: {ESC: 27},
    getRandomInteger: getRandomInteger,
    getRandomArrayElement: getRandomArrayElement,
    checkFocusOnElement: checkFocusOnElement,
    closePopup: closePopup,
    getShuffle: getShuffle,
    imgUploadOverlay: imgUploadOverlay,
    removeChildren: removeChildren,
    createTagElement: createTagElement,
  }
})();
