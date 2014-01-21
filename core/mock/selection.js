/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview laymans selection module.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

window.DomPosition = function(container, offset) {
  this.container = container;
  this.offset = offset;
}

DomPosition.prototype = {
  __proto__: Object.prototype,

  insideTextNode: function() {
    return this.container.nodeType === Node.TEXT_NODE;
  }
};




window.Selection = {

  startDomPosition: function() {
    var sel = window.getSelection();
    if (sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      return new DomPosition(range.startContainer, range.startOffset);
    }
  },

  // if IP is inside a text node, split the text node
  // and return the IP relative to the parent element instead
  guaranteeElementDomPosition: function() {
    var ip = this.domPosition();
    if (ip) {
      if (ip.container.nodeType !== Node.TEXT_NODE) {
        return ip;
      } else {
        var tnOffset = DomUtils.splitText(ip.container, ip.offset);
        return new DomPosition(ip.container.parentNode, tnOffset);
      }
    }
  },

  setDomPosition: function(domPosition) {
    var range = document.createRange();
    range.setStart(domPosition.container, domPosition.offset);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  },

  walkUp: function(callback) {
    var sel = window.getSelection();
    var range;
    if (sel.rangeCount > 0) {
      range = sel.getRangeAt(0);
    }
    var container = range ? range.startContainer : undefined;
    while (container) {
      var ret = callback.call(this, container);
      if (ret) {
        return ret;
      }
      container = container.parentNode;
    }
  },


  findSupportingNode: function(funcName) {
    return this.walkUp(function(node) {
      if (node && node[funcName] !== undefined) {
        return node;
      }
    });
  }

};