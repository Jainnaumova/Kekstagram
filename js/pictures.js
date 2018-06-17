'use strict';
var PHOTO_NUMBER = 25;
var MIN_NUMBER_LIKES = 15;
var MAX_NUMBER_LIKES = 200;
var MIN_NUMBER_COMMENTS = 1;
var MAX_NUMBER_COMMENTS = 2;
var PICTURE_WIDTH = 35;
var PICTURE_HEIGHT = 35;

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

function createBigPicture(picture) {
  var bigPicture = document.querySelector('.big-picture');
  var comments = bigPicture.querySelector('.social__comments');

  bigPicture.classList.remove('hidden');

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

  return bigPicture;
}

function renderPreviewPictures() {
  var pictureListElement = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture').content;
  var fragment = document.createDocumentFragment();
  var pictureDisplay;
  for (var i = 0; i < PHOTO_NUMBER; i++) {
    var newPhoto = createRandomPicture(i);
    if (i === 0) {
      pictureDisplay = newPhoto;
    }
    fragment.appendChild(createPictureElement(pictureTemplate, newPhoto));
  }
  if (pictureDisplay) {
    createBigPicture(pictureDisplay);
  }
  pictureListElement.appendChild(fragment);
}
renderPreviewPictures();
