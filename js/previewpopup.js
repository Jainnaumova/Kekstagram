'use strict';
window.previewpopup = (function() {
  var PICTURE_WIDTH = 35;
  var PICTURE_HEIGHT = 35;
  var bigPicture = document.querySelector('.big-picture');
  var buttonBigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

  function createCommentElement(comment) {
    var tagList = window.util.createTagElement('li', 'social__comment social__comment--text');
    var pictureComment = window.util.createTagElement('img', 'social__picture');

    pictureComment.src = 'img/avatar-' + window.util.getRandomInteger(1, 6) + '.svg';
    pictureComment.alt = 'Аватар комментатора фотографии';
    pictureComment.width = PICTURE_WIDTH;
    pictureComment.height = PICTURE_HEIGHT;

    var itemText = document.createTextNode(comment);
    tagList.appendChild(pictureComment);
    tagList.appendChild(itemText);

    return tagList;
  }

  function createBigPicture(picture, alt) {
    if (!picture) {
      return;
    }
    var bigPicture = document.querySelector('.big-picture');
    var comments = bigPicture.querySelector('.social__comments');

    bigPicture.classList.remove('hidden');

    document.addEventListener('keydown', documentKeyDownHandler);
    buttonBigPictureCancel.addEventListener('click', closeBigPicture);

    bigPicture.querySelector('.big-picture__img img').src = picture.url;
    bigPicture.querySelector('.big-picture__img img').alt = picture.alt
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
    bigPicture.querySelector('.social__caption').textContent = picture.description;
  // delete init comments
    window.util.removeChildren(comments);

    var commentsList = document.querySelector('.social__comments');
    for (var i = 0; i < picture.comments.length; i++) {
      var pictureItem = createCommentElement(picture.comments[i]);
      commentsList.appendChild(pictureItem);
    }

    bigPicture.querySelector('.social__comment-count').classList.add('.visually-hidden');
    bigPicture.querySelector('.social__comment-loadmore').classList.add('.visually-hidden');
  }

  function closeBigPicture() {
    window.util.closePopup(bigPicture);
    document.removeEventListener('keydown', documentKeyDownHandler);
    buttonBigPictureCancel.removeEventListener('click', closeBigPicture);
  }

  function documentKeyDownHandler(evt) {
    if (evt.keyCode === window.util.KEYCODE.ESC && !window.util.checkFocusOnElement('.social__footer-text')) {
      closeBigPicture();
    }
  }

  return {
    createBigPicture: createBigPicture
  };

})();
