'use strict';
(function() {

  var MIN_NUMBER_LIKES = 15;
  var MAX_NUMBER_LIKES = 200;
  var MIN_NUMBER_COMMENTS = 1;
  var MAX_NUMBER_COMMENTS = 2;

  function createRandomPicture(i) {
    return {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: window.util.getRandomInteger(MIN_NUMBER_LIKES, MAX_NUMBER_LIKES),
      comments: window.util.getShuffle(window.photodata.photoComments).slice(0, window.util.getRandomInteger(MIN_NUMBER_COMMENTS, MAX_NUMBER_COMMENTS)),
      description: window.util.getRandomArrayElement(window.photodata.photoDescription)
    }
  }

  function createPictureElement(photoTemplate, picture) {
  // copy template into variable

    var pictureElement = photoTemplate.cloneNode(true);
  // push data into variable
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__img').alt = picture.alt;
    pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

    return pictureElement;
  }

  function createArrayPictures() {
    var pictures = [];
    for (var i = 0; i < window.photodata.photoNumber; i++) {
      pictures.push(createRandomPicture(i));
    }
    return pictures;
  }

  var randomPictures = null;
  var pictureAlt = null;
  var body = document.querySelector('body');
  
  function renderPreviewPictures() {
    var pictureListElement = document.querySelector('.pictures');

    var pictureTemplate = document.querySelector('#picture').content;

    pictureAlt = pictureTemplate.querySelector('.picture__img').alt;

    var fragment = document.createDocumentFragment();

    randomPictures = createArrayPictures();
    for (var i = 0; i < randomPictures.length; i++) {
      var picturePreview = createPictureElement(pictureTemplate, randomPictures[i]);
      var img = picturePreview.querySelector('.picture__img');
      img.dataset.index = i;
      fragment.appendChild(picturePreview);
    }
    pictureListElement.appendChild(fragment);

    // show big picture
    pictureListElement.addEventListener('click', pictureClickHandler);
  }

  function pictureClickHandler(evt) {
    var targetIndexPicture = evt.target.dataset.index;
    window.previewpopup.createBigPicture(randomPictures[targetIndexPicture], pictureAlt);
    body.classList.add('.modal-open');
  }

  renderPreviewPictures();

})()
