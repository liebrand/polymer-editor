(function() {

  function defineGetter_(obj, map) {
    for (var key in map) {
      console.log(key, map[key])
      var value = map[key];
      Object.defineProperty(obj, key, {
        get: function() {
          return value;
        }
      });
    }
  }

  function makeKeyBoardEvent_(key, type, modifiers) {
    modifiers = modifiers || {};
    var evt = document.createEvent('KeyboardEvent');
    evt.initKeyboardEvent(type, true, true, window, key.name, 0,
        !! modifiers.control,
        !! modifiers.alt,
        !! modifiers.shift,
        !! modifiers.meta,
        !! modifiers.altGraph);

    evt.origin = 'mockKeyboard';
    Object.defineProperty(evt, 'keyCode', {get: function() {return key.keyCode;}});
    Object.defineProperty(evt, 'charCode', {get: function() {return key.charCode;}});
    Object.defineProperty(evt, 'which', {get: function() {return key.which;}});
    Object.defineProperty(evt, 'keyIdentifier', {get: function() {return key.keyIdentifier;}});

    return evt;
  }


  window.EventUtils = {

    makeEvent: function(key, type, timeout) {
      return when.promise(function(resolve, reject) {

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