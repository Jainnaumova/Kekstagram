'use strict';
(function() {

  var uploadFile = document.querySelector('#upload-file');
  var imgOverlay = window.util.imgUploadOverlay;

  var buttonUploadCancel = window.util.imgUploadOverlay.querySelector('.img-upload__cancel');

  function checkOverlayIsHidden() {
    return window.util.imgUploadOverlay.classList.contains('hidden');
  }

  uploadFile.addEventListener('change', openOverlay);

  // open Upload Form
  function openOverlay() {
    if (checkOverlayIsHidden()) {
      imgOverlay.classList.remove('hidden');
      document.addEventListener('keydown', documentKeyDownHandler);
      buttonUploadCancel.addEventListener('click', imgUploadClickHandler);
// set handlers
// call editor
      window.imguploadeditor.activate();
// call validation hashtag
      window.imguploadvalidation.activate();
    }
  }

  // close Upload form
  function imgUploadClickHandler() {
    window.util.closePopup(imgOverlay);
    document.removeEventListener('keydown', documentKeyDownHandler);
    buttonUploadCancel.removeEventListener('click', imgUploadClickHandler);
// remove handlers
    window.imguploadeditor.deactivate();
    window.imguploadvalidation.deactivate();

    uploadFile.value = '';
  }

  function documentKeyDownHandler(evt) {
    if (evt.keyCode === window.util.KEYCODE.ESC && !window.util.checkFocusOnElement('.text__hashtags') && !window.util.checkFocusOnElement('.text__description')) {
      imgUploadClickHandler();
    }
  }
  
})()
