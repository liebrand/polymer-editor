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
    defineGetter_(evt, {
      'keyCode': key.charCodeAt(0)
    });
    return evt;
  }


  window.EventUtils = {

    makeEvent: function(key, type, timeout) {

      return new Promise(function(resolve, reject) {

        window.setTimeout(function() {
          try {
            document.body.dispatchEvent(makeKeyBoardEvent_(key, type));
            resolve();
          } catch (e) {
            reject(e);
          }
        }, timeout);

      });

    }
  };

})();