
// used to type text:
// Keyboard.type(text('hello'));
// Keyboard.type(text('one'), keys('⌘','b'));

var Text = function(textToType) {
  this.textToType = textToType;
};

Text.prototype = {
  __proto__: Object.prototype,
  getPromise: function() {

    var chain = when.promise(function(resolve, reject) {
      resolve();
    });

    for (var i = 0; i < this.textToType.length; i++) {
      var letter = getKeyObjext(this.textToType[i]);

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

window.text = function(textToType) {
  var textInstance = new Text(textToType);
  return textInstance;
};
