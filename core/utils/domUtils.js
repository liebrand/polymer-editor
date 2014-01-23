
define([
  'core/utils/preOrderIter'
  ], function(PreOrderIter) {

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

    deleteEmptyTree: function(node) {
      while (this.isEmpty(node)) {
        var parent = node.parentNode;
        // TODO(jliebrand): should we do parent.supports('deleteNode') and
        // node.supports('deleteMe') ??
        parent.removeChild(node);
        node = parent;
      }
    },

    isLeaf: function(node) {
      return node.childNodes.length === 0;
    },

    /**
     * Determine whether a node's text content is entirely whitespace.
     * Where whitespace is defined as one of the characters
     *  "\t" TAB \u0009
     *  "\n" LF  \u000A
     *  "\r" CR  \u000D
     *  " "  SPC \u0020
     *
     * This does not use Javascript's "\s" because that includes non-breaking
     * spaces (and also some other characters).
     *
     */
    isAllWhiteSpace: function(node) {
      return !(/[^\t\n\r ]/.test(node.textContent));
    },

    isIgnorable: function(node) {
      return ( node.nodeType == Node.COMMENT_NODE) ||
             ( (node.nodeType == Node.TEXT_NODE) && this.isAllWhiteSpace(node) );
    },

    isEmpty: function(node) {
      var empty = true;
      for (var i = node.childNodes.length - 1; i >= 0; i--) {
        if (!this.isIgnorable(node.childNodes[i])) {
          empty = false;
          break;
        }
      }
      return empty;
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
     *  previousLeaf(C) === E
     *  previousLeaf(G) === H
     *  previousLeaf(F) === E
     *  previousLeaf(E) === D
     */
    previousLeaf: function(srcNode) {
      // get previous "non-white-space-only" leaf
      var leaf;
      var iter = new PreOrderIter(srcNode);
      while((leaf = iter.prev())) {
        if (this.isLeaf(leaf) && !this.isIgnorable(leaf)) {
          break;
        }
      }
      return leaf;
    },

    // opposite of previousLeaf
    nextLeaf: function(srcNode) {
      // get previous "non-white-space-only" leaf
      var leaf;
      var iter = new PreOrderIter(srcNode);
      while((leaf = iter.next())) {
        if (this.isLeaf(leaf) && !this.isIgnorable(leaf)) {
          break;
        }
      }
      return leaf;
    }
  };

  return DomUtils;
});
