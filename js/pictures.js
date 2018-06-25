'use strict';
var PHOTO_NUMBER = 25;
var MIN_NUMBER_LIKES = 15;
var MAX_NUMBER_LIKES = 200;
var MIN_NUMBER_COMMENTS = 1;
var MAX_NUMBER_COMMENTS = 2;
var PICTURE_WIDTH = 35;
var PICTURE_HEIGHT = 35;

var ESC_KEYCODE = 27;

var STEP_RESIZE = 25;
var MIN_IMAGE_SIZE = 25;
var MAX_IMAGE_SIZE = 100;

var PHOTO_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

var PHOTO_DESCRIPTION = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

function getRandomIndex(number) {
  return Math.floor(number * Math.random());
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getRandomArrayElement(array) {
  return array[getRandomIndex(array.length)];
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
};

// Data for RandomPicture
function createRandomPicture(i) {
  return {
    url: 'photos/' + (i + 1) + '.jpg',
    likes: getRandomInteger(MIN_NUMBER_LIKES, MAX_NUMBER_LIKES),
    comments: getShuffle(PHOTO_COMMENTS).slice(0, getRandomInteger(MIN_NUMBER_COMMENTS, MAX_NUMBER_COMMENTS)),
    description: getRandomArrayElement(PHOTO_DESCRIPTION)
  }
};

// create picture using photoTemplate

function createPictureElement(photoTemplate, picture) {
// copy template into variable

  var pictureElement = photoTemplate.cloneNode(true);
// push data into variable
  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__img').alt = picture.alt;
  pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;
  return pictureElement;
};

function createTagElement(tagName, className) {
  var element = document.createElement(tagName);
  className.split(' ').forEach(function(cln) {
    element.classList.add(cln);
  });
  return element;
}

function createCommentElement(comment) {
  var tagList = createTagElement('li', 'social__comment social__comment--text');
  var pictureComment = createTagElement('img', 'social__picture');

  pictureComment.src = 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
  pictureComment.alt = 'Аватар комментатора фотографии';
  pictureComment.width = PICTURE_WIDTH;
  pictureComment.height = PICTURE_HEIGHT;

  var itemText = document.createTextNode(comment);
  tagList.appendChild(pictureComment);
  tagList.appendChild(itemText);

  return tagList;
}

function removeChildren(comments) {
  while (comments.firstChild) {
    comments.removeChild(comments.firstChild);
  }
}

function createBigPicture(picture, alt) {
  if (!picture) {
    return;
  }
  var bigPicture = document.querySelector('.big-picture');
  var comments = bigPicture.querySelector('.social__comments');

  bigPicture.classList.remove('hidden');

  document.addEventListener('keydown', buttonBigPictureCancelEscPressHandler);

  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.big-picture__img img').alt = picture.alt
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;

  removeChildren(comments);

  var commentsList = document.querySelector('.social__comments');
  for (var i = 0; i < picture.comments.length; i++) {
    var pictureItem = createCommentElement(picture.comments[i]);
    commentsList.appendChild(pictureItem);
  }

  bigPicture.querySelector('.social__comment-count').classList.add('.visually-hidden');
  bigPicture.querySelector('.social__comment-loadmore').classList.add('.visually-hidden');
}

function createArrayPictures() {
  var pictures = [];
  for (var i = 0; i < PHOTO_NUMBER; i++) {
    pictures.push(createRandomPicture(i));
  }
  return pictures;
}

function renderPreviewPictures() {
  var pictureListElement = document.querySelector('.pictures');
  var body = document.querySelector('body');
  var pictureTemplate = document.querySelector('#picture').content;

  var pictureAlt = pictureTemplate.querySelector('.picture__img').alt;
  var fragment = document.createDocumentFragment();
  var randomPictures = createArrayPictures();

  for (var i = 0; i < randomPictures.length; i++) {
    var picturePreview = createPictureElement(pictureTemplate, randomPictures[i]);
    var img = picturePreview.querySelector('.picture__img');
    img.dataset.index = i;
    fragment.appendChild(picturePreview);
  }
  pictureListElement.appendChild(fragment);
  pictureListElement.addEventListener('click', function(evt) {
    var targetIndexPicture = evt.target.dataset.index;
    createBigPicture(randomPictures[targetIndexPicture], pictureAlt);
    body.classList.add('.modal-open');

    buttonBigPictureCancel.addEventListener('click', closeBigPicture);
  })
}
renderPreviewPictures();

// open & close picture

var uploadFile = document.querySelector('#upload-file');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var effectsList = imgUploadOverlay.querySelector('.img-upload__effects');
var buttonUploadCancel = imgUploadOverlay.querySelector('.img-upload__cancel');
var bigPicture = document.querySelector('.big-picture');
var buttonBigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

function checkFocusOnElement(className) {
  return document.querySelector(className) === document.activeElement;
}

function checkOverlayIsHidden() {
  return imgUploadOverlay.classList.contains('hidden');
}

uploadFile.addEventListener('change', openOverlay);

// open Upload Form
function openOverlay() {
  if (checkOverlayIsHidden()) {
    imgUploadOverlay.classList.remove('hidden');
    resizeImg(100);
    document.addEventListener('keydown', buttonCancelUploadEscPressHandler);
    buttonUploadCancel.addEventListener('click', imgUploadClickHandler);
    effectsList.addEventListener('click', effectsListClickHandler);
    scalePin.addEventListener('mouseup', scalePinMouseupHandler);
    // reset filters & hide slider
    imgUploadPicture.removeAttribute('class');
    scaleSlider.classList.add('hidden');
  }
}

// close Upload form
function imgUploadClickHandler() {
  closePopup(imgUploadOverlay);
  document.removeEventListener('keydown', buttonCancelUploadEscPressHandler);
  buttonUploadCancel.removeEventListener('click', imgUploadClickHandler);
  effectsList.removeEventListener('click', effectsListClickHandler);
  scalePin.removeEventListener('mouseup', scalePinMouseupHandler);
  uploadFile.value = '';
}

function closePopup(popup) {
  popup.classList.add('hidden');
}

function buttonCancelUploadEscPressHandler(evt) {
  if (evt.keyCode === ESC_KEYCODE && !checkFocusOnElement('.text__hashtags') && !checkFocusOnElement('.text__description')) {
    imgUploadClickHandler();
  }
}

function closeBigPicture() {
  closePopup(bigPicture);
  document.removeEventListener('keydown', buttonBigPictureCancelEscPressHandler);
  buttonBigPictureCancel.removeEventListener('click', closeBigPicture);
}

function buttonBigPictureCancelEscPressHandler(evt) {
  if (evt.keyCode === ESC_KEYCODE && !checkFocusOnElement('.social__footer-text')) {
    closeBigPicture();

  }
}

// Transformation uploaded Pictire
var resizeControl = imgUploadOverlay.querySelector('.resize__control--value');
var imgUpload = imgUploadOverlay.querySelector('.img-upload__preview');
var imgUploadPicture = imgUpload.querySelector('img');

// changing of size uploaded Picture
function resizeImg(step) {
  var resizeControlInt = +resizeControl.value.slice(0, -1);
  var size = resizeControlInt + step;

  if (size < MIN_IMAGE_SIZE) {
    size = MIN_IMAGE_SIZE;
  } else {
    if (size > MAX_IMAGE_SIZE) {
      size = MAX_IMAGE_SIZE;
    }
  }
  resizeControl.value = (size) + '%';
  imgUploadPicture.style.transform = 'scale(' + size / MAX_IMAGE_SIZE + ')';
}

imgUploadOverlay.querySelector('.resize__control--minus').addEventListener('click', function() {
  resizeImg(-STEP_RESIZE);
})
imgUploadOverlay.querySelector('.resize__control--plus').addEventListener('click', function() {
  resizeImg(STEP_RESIZE);
})

// editing uploaded Picture - filters
var scaleSlider = document.querySelector('.img-upload__scale');
var scalePin = scaleSlider.querySelector('.scale__pin');
var scaleLine = scaleSlider.querySelector('.scale__line');
var scaleLevel = scaleSlider.querySelector('.scale__level');
var scaleValue = scaleSlider.querySelector('.scale__value');
var effects = effectsList.querySelectorAll('.effects__radio');

function scalePinMouseupHandler() {
  switch (selectEffect()) {
    case 'chrome':
      setImgUploadFilter('grayscale', 0, 1);
      break;
    case 'sepia':
      setImgUploadFilter('sepia', 0, 1);
      break;
    case 'marvin':
      setImgUploadFilter('invert', 0, 100, '%');
      break;
    case 'phobos':
      setImgUploadFilter('blur', 0, 3, 'px');
      break;
    case 'heat':
      setImgUploadFilter('brightness', 1, 3);
      break;
    case 'none':
      scaleSlider.classList.add('hidden');
      debugger
      imgUploadPicture.removeAttribute('class');
  }
}

function showSlider() {
  if (scaleSlider.classList.contains('hidden')) {
    scaleSlider.classList.remove('hidden');
  }
}

// add class to uploaded Picture
function setClassEffect(filter) {
  if (!imgUploadPicture.classList.contains('effects__preview--' + filter)) {
    showSlider();
    imgUploadPicture.removeAttribute('class');
    imgUploadPicture.classList.add('effects__preview--' + filter);
  }
}

// set filter on uploaded Picture
function setImgUploadFilter(filter, min, max, dimention) {
  showSlider();
  var scale = (scalePin.offsetLeft * (max - min) / scaleLine.offsetWidth) + min;
  imgUploadPicture.style.filter = filter + '(' + scale + (dimention ? dimention : '') + ')';
  scaleValue.value = scale;
}

// set default Pin position
function setDefaultPositionPin() {
  scalePin.style.left = '100%';
  scaleLevel.style.width = '100%';
  scaleValue.value = 100;
  imgUploadPicture.style.filter = '';
}

// check effect of uploaded Pictire
function selectEffect() {
  var checkedEffect;
  for (var i = 0; i < effects.length; i++) {
    if (effects[i].checked) {
      checkedEffect = effects[i].value;
    }
  }
  return checkedEffect;
}

// set effect on the uploaded Picture
function effectsListClickHandler(evt) {
  var evtValue = evt.target.value;
  if (evtValue === 'none') {
    scaleSlider.classList.add('hidden');
    imgUploadPicture.style.filter = '';
    imgUploadPicture.removeAttribute('class');
    scaleValue.value = 0;
  } else {
      setDefaultPositionPin();
      setClassEffect(selectEffect());
  }
}
