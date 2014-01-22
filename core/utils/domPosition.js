
define([], function() {

  'use strict';

  var DomPosition = function(container, offset) {
    this.container = container;
    this.offset = offset;
  }

  DomPosition.prototype = {
    __proto__: Object.prototype,

    insideTextNode: function() {
      return this.container.nodeType === Node.TEXT_NODE;
    }
  };

  return DomPosition;
});