'use strict';

window.imguploadvalidation = (function() {
  var MAX_LENGTH_HASHTAG = 20;
  var MAX_COUNT_HASHTAGS = 5;

  var form = document.querySelector('.img-upload__form');

  var hashtagsUpload = window.util.imgUploadOverlay.querySelector('.text__hashtags');
  function hashtagSubmitHandler() {
    var hashtagsString = hashtagsUpload.value;
    if (hashtagsString.length === 0) {
      return;
    }

    var hashtagsArray = hashtagsString.split(' ');
    var textError = '';

    var uniqueHashtags = [];
    for (var i = 0; i < hashtagsArray.length; i++) {
      var hashtag = hashtagsArray[i].trim().toLowerCase();
      var errorClass = '';

      if (hashtag.length === 0) {
        continue;
      } else if (hashtag.length > MAX_LENGTH_HASHTAG) {
        textError = 'Hashtag should not be more than 20 characters';
        errorClass = 'text__error';
        break;
      } else if (hashtag.slice(0, 1) !== '#') {
        textError = 'Hashtag should start from #';
        errorClass = 'text__error';
        break;
      } else if (hashtag.length === 1) {
        textError = 'Hashtag should contain more than 1 character';
        errorClass = 'text__error';
        break;
      } else if (hashtag.indexOf('#', 1) !== -1) {
        textError = 'Hashtag should not contain two #';
        errorClass = 'text__error';
        break;
      } else if (uniqueHashtags.indexOf(hashtag) !== -1) {
        textError = 'Hashtags should be unique';
        errorClass = 'text__error';
      }
      uniqueHashtags.push(hashtag);
    }

    if (uniqueHashtags.length > MAX_COUNT_HASHTAGS) {
      textError = 'Number of hashtags should not be more than 5';
      errorClass = 'text__error';
    }

    hashtagsUpload.setCustomValidity(textError);
    if (errorClass.trim() !== '') {
      hashtagsUpload.classList.add(errorClass);
    } else if (hashtagsUpload.classList.contains('text__error')) {
      hashtagsUpload.classList.remove('text__error');
    }
  }

  function activate() {
    hashtagsUpload.addEventListener('blur', hashtagSubmitHandler);

    hashtagsUpload.addEventListener('keydown', function() {
      hashtagsUpload.setCustomValidity('');
    });

    form.addEventListener('submit', hashtagSubmitHandler);
  }

  function deactivate() {
    form.removeEventListener('submit', hashtagSubmitHandler);
  }

  return {
    activate: activate,
    deactivate: deactivate
  };

})();
