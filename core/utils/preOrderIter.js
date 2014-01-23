define([], function() {

  'use strict';

  var PreOrderIter = function(startNode) {
    this.current_ = startNode;
  };

  PreOrderIter.prototype = {
    __proto__: Object.prototype,

    current: function() {
      return this.current_;
    },
    next: function() {
      return this.current_ = this.getNext_();
    },
    hasNext: function() {
      return this.getNext_() !== undefined;
    },
    prev: function() {
      return this.current_ = this.getPrev_();
    },
    hasPrev: function() {
      return this.getPrev_() !== undefined;
    },


    getNext_: function() {
      var ref = this.current_;
      var next = ref.firstChild;
      while (!next && ref) {
        next = ref.nextSibling;
        ref = ref.parentNode;
      }
      return next;
    },

    getPrev_: function() {
      var ref = this.current_;
      var prev = ref.previousSibling;
      while (prev && prev.lastChild) {
        prev = prev.lastChild;
      }
      if (!prev) {
        prev = ref.parentNode;
      }
      return prev;
    }
  };

  return PreOrderIter;
});