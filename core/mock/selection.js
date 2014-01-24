/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview laymans selection module.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define(['core/utils/domPosition'], function(DomPosition) {

  'use strict';

  var Selection = {

    startDomPosition: function() {
      var sel = window.getSelection();
      if (sel.rangeCount > 0) {
        var range = sel.getRangeAt(0);
        return new DomPosition(range.startContainer, range.startOffset);
      }
    },

    setStartDomPosition: function(domPosition) {
      if (domPosition &&
          domPosition.container && domPosition.offset !== undefined) {
        var range = document.createRange();
        range.setStart(domPosition.container, domPosition.offset);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
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

  return Selection;
});

