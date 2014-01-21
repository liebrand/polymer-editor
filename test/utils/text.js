
// used to type text:
// Keyboard.type(text('hello'));
// Keyboard.type(text('one'), keys('⌘','b'));

(function() {
  'use strict';

  // TODO(jliebrand): this is crap; how should one combine AMD style JS with
  // html imports (in such a way to not just satisfy jshint, but also actually
  // ensure that files are indeed loaded in dependency order??
  var EventUtils = window.EventUtils;

  var Text = function(textToType) {
    this.textToType = textToType;
  };

  Text.prototype = {

    getPromise: function() {

      var chain = when.promise(function(resolve, reject) {
        resolve();
      });
      var createEvent = function(chain, type) {
        return chain.then(EventUtils.makeEvent.bind(null, letter, type));
      };

      for (var i = 0; i < this.textToType.length; i++) {
        var letter = window.getKeyObjext(this.textToType[i]);

        // our fake Input module, only cares about keydown and keypress, so no
        // need to fake all the other events for this POC
        // var types = ['keydown', 'keypress', 'textInput', 'keyup'];
        var types = ['keydown', 'keypress'];
        types.reduce(createEvent, chain);
      }

      return chain;
    }
  };

  window.text = function(textToType) {
    var textInstance = new Text(textToType);
    return textInstance;
  };

})();

