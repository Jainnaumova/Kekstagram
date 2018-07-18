'use strict';

window.imguploadeditor = (function () {

  var STEP_RESIZE = 25;
  var MIN_IMAGE_SIZE = 25;
  var MAX_IMAGE_SIZE = 100;

  var effectsList = window.util.imgUploadOverlay.querySelector('.img-upload__effects');
  // debugger
  var resizeControl = window.util.imgUploadOverlay.querySelector('.resize__control--value');
  // debugger
  var imgUpload = window.util.imgUploadOverlay.querySelector('.img-upload__preview');
  var imgUploadPicture = imgUpload.querySelector('img');

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

  // without filter
  function setDefaultFilter() {
    scaleSlider.classList.add('hidden');
    imgUploadPicture.removeAttribute('class');
    imgUploadPicture.style.filter = '';
    scaleValue.value = 0;
  }

  window.util.imgUploadOverlay.querySelector('.resize__control--minus').addEventListener('click', function() {
    resizeImg(-STEP_RESIZE);
  })
  window.util.imgUploadOverlay.querySelector('.resize__control--plus').addEventListener('click', function() {
    resizeImg(STEP_RESIZE);
  })

  // editing uploaded Picture - filters
  var scaleSlider = document.querySelector('.img-upload__scale');
  var scalePin = scaleSlider.querySelector('.scale__pin');
  var scaleLine = scaleSlider.querySelector('.scale__line');
  var scaleLevel = scaleSlider.querySelector('.scale__level');
  var scaleValue = scaleSlider.querySelector('.scale__value');
  var effects = effectsList.querySelectorAll('.effects__radio');

  // create object with filter's parameters during slider moving
  function createEffectParameters(filter, min, max, dimention) {
    return {
      filter: filter,
      min: min,
      max: max,
      dimention: dimention
    };
  }

  // set slader filter's PositionPin and effects
  function setFilterValue(left, width) {
    var selectedEffect = selectEffect();
    if (selectedEffect === 'none') {
      setDefaultFilter();
      return;
    }

    var effectParameters = {};

    switch (selectedEffect) {
      case 'chrome':
        effectParameters = createEffectParameters('grayscale', 0, 1);
        break;
      case 'sepia':
        effectParameters = createEffectParameters('sepia', 0, 1);
        break;
      case 'marvin':
        effectParameters = createEffectParameters('invert', 0, 100, '%');
        break;
      case 'phobos':
        effectParameters = createEffectParameters('blur', 0, 3, 'px');
        break;
      case 'heat':
        effectParameters = createEffectParameters('brightness', 1, 3);
        break;
      default:
        throw new Error ('Undefined filter' + selectedEffect)
    }
    var scale = left * (effectParameters.max - effectParameters.min) / width + effectParameters.min;
    setImgUploadFilter(effectParameters.filter, scale, effectParameters.dimention);
  }

  function showSlider() {
    if (scaleSlider.classList.contains('hidden')) {
      scaleSlider.classList.remove('hidden');
    }
  }

  // add class to uploaded Picture
  function setClassEffect(filter) {
    if (!imgUploadPicture.classList.contains(filter)) {
      showSlider();
      imgUploadPicture.removeAttribute('class');
      imgUploadPicture.classList.add('effects__preview--' + filter);
    }
  }

  // set filter on uploaded Picture
  function setImgUploadFilter(filter, scale, dimention) {
    showSlider();
    imgUploadPicture.style.filter = filter + '(' + scale + (dimention ? dimention : '') + ')';
  }

  // set default Pin position 100%
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
      setDefaultFilter();
    } else {
        setDefaultPositionPin();
        setClassEffect(selectEffect());
    }
  }

  // calculation of effect's deep according of position scale's Pin
  var startX = null;

  function scalePinMoveHandler(moveEvt) {
    moveEvt.preventDefault();
// debugger
    var shiftX = startX - moveEvt.clientX;
    startX = moveEvt.clientX;

    // calculation of slider Position
    var scaleLineWidth = scaleLine.offsetWidth;

    var scalePinCoordsX = scalePin.offsetLeft - shiftX;
    if (scalePinCoordsX >= 0 && scalePinCoordsX <= scaleLineWidth) {
      scalePin.style.left = scalePinCoordsX + 'px';
      scaleLevel.style.width = scalePinCoordsX + 'px';
      setFilterValue(scalePinCoordsX, scaleLineWidth);
      var valuePercent = scalePinCoordsX * 100 / scaleLineWidth;
      scaleValue.value = Math.round(valuePercent);
    }
  }

  function scalePinMoveUpHandler(upEvt) {
    upEvt.preventDefault();

    // startX = upEvt.clientX;
    document.removeEventListener('mousemove', scalePinMoveHandler);
    document.removeEventListener('mouseup', scalePinMoveUpHandler);
  }

  function scalePinMouseDownHandler(evt) {
    evt.preventDefault();

    startX = evt.clientX;
    document.addEventListener('mousemove', scalePinMoveHandler);
    document.addEventListener('mouseup', scalePinMoveUpHandler);
  }

  function activate() {
// debugger
    scalePin.addEventListener('mousedown', scalePinMouseDownHandler);
    setDefaultFilter();
    resizeImg(100);
    effectsList.addEventListener('click', effectsListClickHandler);
  }

  function deactivate() {
    effectsList.removeEventListener('click', effectsListClickHandler);
    scalePin.removeEventListener('mousedown', scalePinMouseDownHandler);
  }

  return {
    activate: activate,
    deactivate: deactivate
  }

})();
