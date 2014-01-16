(function() {

  function defineGetter_(obj, map) {
    for (var key in map) {
      Object.defineProperty(obj, key, {
        get: function() {
          return map[key];
        }
      });
    }
  }

  function makeKeyBoardEvent_(key, type, modifiers) {
    modifiers = modifiers || {};
    var evt = document.createEvent('KeyboardEvent');
    evt.initKeyboardEvent(type, true, true, window, key, 0,
        !! modifiers.control,
        !! modifiers.alt,
        !! modifiers.shift,
        !! modifiers.meta,
        !! modifiers.altGraph);

    evt.origin = 'mockKeyboard';
    // The event init method does not set all the required
    // properties so we brute force set them on the object.
    defineGetter_(evt, {
      'charCode': key.charCode,
      'keyCode': key.keyCode,
      'keyIdentifier': key.keyIdentifier,
      'which': key.which
    });
    return evt;
  }

  function makeTextEvent_(key) {
    var evt = document.createEvent('TextEvent');
    evt.initTextEvent('textInput', true, true, window, key, 0);
    evt.origin = 'mockKeyboard';
    // The event init method does not set all the required
    // properties so we brute force set them on the object.
    defineGetter_(evt, {
      'charCode': key.charCode,
      'keyCode': key.keyCode,
      'which': key.which
    });
    return evt;
  }


  window.EventUtils = {

    makeEvent: function(key, type, timeout) {

      return new Promise(function(resolve, reject) {

        window.setTimeout(function() {
          try {
            switch (type) {
              case 'textInput':
                document.body.dispatchEvent(makeTextEvent_(key));
                break;

              case 'keydown':
              case 'keyup':
              case 'keypress':
                document.body.dispatchEvent(makeKeyBoardEvent_(key, type));
                break;

              default:
                break;
            }
            resolve();
          } catch (e) {
            reject(e);
          }
        }, timeout);

      });

    }
  };

})();