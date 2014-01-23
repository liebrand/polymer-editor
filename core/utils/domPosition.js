
define([
  'core/utils/domUtils'
  ], function(
    DomUtils
    ) {

  'use strict';

  var DomPosition = function(container, offset) {
    this.container = container;
    this.offset = offset;
  }

  DomPosition.prototype = {
    __proto__: Object.prototype,

    insideTextNode: function() {
      return this.container.nodeType === Node.TEXT_NODE;
    },

    /**
     * return true if the position is on a node boundary.
     * Either the caret is in between ELEMENTs or it is at
     * the start/end of a TEXT_NODE
     *
     * @param {string} opt_side optionally check one side, either "left/right"
     *                          or for conveniance sake "backward/forward"
     */
    onNodeBoundary: function(opt_side) {
      if (this.container.nodeType !== Node.TEXT_NODE) {
        return true;
      }

      switch(opt_side) {
        case 'backward':
        case 'left':
          return this.offset === 0;
        break;

        case 'forward':
        case 'right':
          return this.offset === this.container.textContent.length;
        break;

        case 'both':
        default:
          return (this.offset === 0 ||
              this.offset === this.container.textContent.length);

        break;
      }
    },

    leftLeaf: function() {
      if (this.insideTextNode() && !this.onNodeBoundary()) {
        throw new Error("DomPosition inside TEXT_NODE; 'leaf' not applicable");
      }
      // "lift" the dom position if we are inside the text node
      // (which should only be the case if we are on the edge of a textnode)
      var container = this.container;
      var offset = this.offset;
      if (this.insideTextNode()) {
        if (this.onNodeBoundary('left')) {
          offset = DomUtils.indexOf(container);
          container = container.parentNode;
        } else if (this.onNodeBoundary('right')) {
          offset = DomUtils.indexOf(container) + 1;
          container = container.parentNode;
        }
      }

      if (container.childNodes.length === 0) {
        // inside an empty element
        return DomUtils.previousLeaf(container);
      }
      if (offset > 0 && offset === container.length) {
        // at the end of our own children, the last one is thus the leftLeaf
        return container.childNodes[offset-1];
      } else {
        // else walk the tree for left leaf
        var rightLeaf = container.childNodes[offset];
        return DomUtils.previousLeaf(rightLeaf);
      }
    },

    rightLeaf: function() {
      if (this.insideTextNode() && !this.onNodeBoundary()) {
        throw new Error("DomPosition inside TEXT_NODE; 'leaf' not applicable");
      }
      // "lift" the dom position if we are inside the text node
      // (which should only be the case if we are on the edge of a textnode)
      var container = this.container;
      var offset = this.offset;
      if (this.insideTextNode()) {
        if (this.onNodeBoundary('left')) {
          offset = DomUtils.indexOf(container);
          container = container.parentNode;
        } else if (this.onNodeBoundary('right')) {
          offset = DomUtils.indexOf(container) + 1;
          container = container.parentNode;
        }
      }

      if (container.childNodes.length === 0) {
        // inside an empty element
        return DomUtils.nextLeaf(container);
      }
      var rightLeaf = container.childNodes[offset];
      if (rightLeaf) {
        return rightLeaf;
      } else {
        var leftLeaf = container.childNodes[offset-1];
        return DomUtils.nextLeaf(leftLeaf);
      }
    }
  };

  return DomPosition;
});