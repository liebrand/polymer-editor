
'use strict';

window.__mockKeys = [];



var Keyboard = {

  type: function() {

    var chain = new Promise(function(resolve, reject) {
      resolve();
    });
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (arg && arg.getPromise) {
        chain = chain.then(arg.getPromise.bind(arg));
      }
    }
    return chain;
  }
};