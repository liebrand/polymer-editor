
// used to type text:
// Keyboard.type(text('hello'));
// Keyboard.type(text('one'), keys('⌘','b'));

var Text = function(textToType) {
  this.textToType = textToType;
};

Text.prototype = {
  __proto__: Object.prototype,
  getPromise: function() {

    var chain = new Promise(function(resolve, reject) {
      resolve();
    });

    for (var i = 0; i < this.textToType.length; i++) {
      var letter = this.textToType[i];
      var types = ['keydown', 'keypress', 'textInput', 'keyup'];
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
