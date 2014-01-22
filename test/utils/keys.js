
// used to type text:
// Keyboard.type(keys('⌘','b'));
//
// should results in:
// ['⌘ keydown','b keydown', '⌘ keyup','b keyup']
//
// Keyboard.type(keys('a', 'b').repeat(2))
// should result in:
// ['a keydown','b keydown', 'a keyup','b keyup',
//  'a keydown','b keydown', 'a keyup','b keyup']

define([
  'test/utils/eventUtils',
  'test/utils/keyCodeMap'], function(
    EventUtils,
    KeyCodeMap) {

  'use strict';

  var Keys = function() {
    this.repeatCount = 1;
    this.keysToPress = [];
    for (var i = 0; i < arguments.length; i++) {
      var key = arguments[i];
      this.keysToPress.push(KeyCodeMap.parseAlias(key));
    }
  };
  Keys.prototype = {

    repeat: function(count) {
      this.repeatCount = count;
      return this;
    },

    getPromise: function() {

      var chain = new Promise(function(resolve, reject) {
        resolve();
      });

      var types = ['keydown', 'keyup'];
      for (var i = 0; i < this.repeatCount; i++) {
        for (var k = 0; k < types.length; k++) {
          var type = types[k];
          for (var j = 0; j < this.keysToPress.length; j++) {
            var keyToPress = KeyCodeMap.getKeyObject(this.keysToPress[j]);
            chain = chain.then(
              EventUtils.makeEvent.bind(null, keyToPress, type));
          }
        }
      }

      return chain;
    }
  };

  return function(keysToPress) {
    var keysInstance = new Keys();
    Keys.apply(keysInstance, arguments);
    return keysInstance;
  };
});

