
// used to type text:
// Keyboard.type(text('hello'));
// Keyboard.type(text('one'), keys('⌘','b'));


var Keys = function() {
  this.keysToPress = [];
  for (var i = 0; i < arguments.length; i++) {
    var key = arguments[i];
    this.keysToPress.push(key);
  }
};
Keys.prototype = {
  __proto__: Object.prototype,
  getPromise: function() {
    var deferred = when.defer();
    var chain = deferred.promise;
    var types = ['down', 'up'];
    for (var j = 0; j < types.length; j++) {
      var type = types[j];
      for (var i = 0; i < this.keysToPress.length; i++) {
        var letter = this.keysToPress[i];
        chain = chain.then(EventUtils.makeEvent.bind(null, letter, type));
      }
    }
    deferred.resolve();
    return chain;
  }
};

window.keys = function(keysToPress) {
  var keysInstance = new Keys();
  Keys.apply(keysInstance, arguments);
  return keysInstance;
};

