
// used to type text:
// Keyboard.type(text('hello'));
// Keyboard.type(text('one'), keys('⌘','b'));

define([
  'test/utils/eventUtils',
  'test/utils/keyCodeMap'], function(
    EventUtils,
    KeyCodeMap) {

  'use strict';

  var Text = function(textToType) {
    this.textToType = textToType;
  };

  Text.prototype = {

    getPromise: function() {

      var chain = new Promise(function(resolve, reject) {
        resolve();
      });

      for (var i = 0; i < this.textToType.length; i++) {
        var letter = KeyCodeMap.getKeyObject(this.textToType[i]);

        // our fake Input module, only cares about keydown and keypress, so no
        // need to fake all the other events for this POC
        // var types = ['keydown', 'keypress', 'textInput', 'keyup'];
        var types = ['keydown', 'keypress'];
        types.forEach(function(type) {
          chain = chain.then(EventUtils.makeEvent.bind(null, letter, type));
        });
      }

      return chain;
    }
  };

  return function(textToType) {
    var textInstance = new Text(textToType);
    return textInstance;
  };

});

