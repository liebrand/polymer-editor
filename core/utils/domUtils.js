
define([], function() {

  'use strict';

  var DomUtils = {

    // split text node in to two, or three nodes
    // all added to the existing parent
    // returns child node offset of the new text node
    splitText: function(textNode, offset, opt_length) {
      if (offset > 0 || opt_length) {
        var parentElement = textNode.parentNode;
        var sibling = textNode.nextSibling;
        var newFrag = document.createDocumentFragment();
        var newTn = textNode.splitText(offset)
        newFrag.appendChild(newTn);
        if (opt_length) {
          newFrag.appendChild(newTn.splitText(opt_length));
        }

        if (sibling) {
          parentElement.insertBefore(newFrag, sibling);
        } else {
          parentElement.appendChild(newFrag);
        }
      }
      return this.indexOf(newTn ? newTn : textNode);
    },

    // return index of element within it's parent
    indexOf: function(child) {
      var offset = 0;
      var prev = child.previousSibling;
      while (prev) {
        offset++;
        prev = prev.previousSibling;
      }
      return offset;
    },

    /**
     * @return {HTML Element} the previous node in reverse document order, eg:
     *
     *                     A
     *                    / \
     *                   /   \
     *                  B     C
     *                 /\     /\
     *                D  E   F  G
     *                      /
     *                     H
     *
     *  previousNode(C) === E
     *  previousNode(G) === H
     *  previousNode(F) === E
     *  previousNode(E) === D
     */
    previousNode: function(srcNode) {
      var prevNode = srcNode ? srcNode.previousSibling : undefined;
      while (!prevNode && srcNode && srcNode.parentNode) {
        srcNode = srcNode.parentNode;
        prevNode = srcNode.previousSibling;
      }
      while (prevNode && prevNode.lastChild) {
        prevNode = prevNode.lastChild;
      }
      return prevNode;
    },

    // opposite of previousNode
    nextNode: function(srcNode) {
      var nextNode = srcNode ? srcNode.nextSibling : undefined;
      while (!nextNode && srcNode && srcNode.parentNode) {
        srcNode = srcNode.parentNode;
        nextNode = srcNode.nextSibling;
      }
      while (nextNode && nextNode.firstChild) {
        nextNode = nextNode.firstChild;
      }
      return nextNode;
    },
  };

  return DomUtils;
});
