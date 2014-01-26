(function() {

  var SPLIT_TREE = {
    editIntent: 'splitTree'
  };
  var DELETE_CHAR = {
    editIntent: 'delete',
    context: {
      direction: 'backward',
      textBoundaryRegEx: /./
    }
  };
  var DELETE_WORD = {
    editIntent: 'delete',
    context: {
      direction: 'backward',
      textBoundaryRegEx: /[^\s]*\s/
    }
  };

  Polymer('polymer-editor-content', {

    shortCuts: {
      'mac' : {
        '↵': SPLIT_TREE,
        '⟵': DELETE_CHAR,
        '⌘ ⟵': DELETE_WORD
      },
      'win': {
        '↵': SPLIT_TREE,
        '⟵': DELETE_CHAR,
        'ctrl ⟵': DELETE_WORD
      }
    },


    /**
     * Main function to query an element's support for a given 'edit intent'
     *
     * @param {string} editIntent identifier of the intent; eg 'insertNode'
     * @param {object} context contextual object for the given intent; usually
     *                         contains a DomPosition where the operation would
     *                         apply and any other required contextual info
     * @return {boolean} true if intent is supported for the given intent
     */
    supports: function(editIntent, context) {
      switch (editIntent) {
        case 'insertNode':
        case 'deleteNode':
        case 'splitNode':
          return true;
          break;
        default:
          return false;
          break;
      }
    },

    insertNode: function(context) {
      if (context.dp) {
        if (this === context.dp.container) {
          // insert the node
          var sibling = this.childNodes[context.dp.offset];
          if (sibling) {
            this.insertBefore(context.node, sibling);
          } else {
            this.appendChild(context.node);
          }
          return true;
        }
      }
    },

    deleteNode: function(context) {
      if (context.dp) {
        if (this === context.dp.container) {
          // delete the node
          this.removeChild(this.childNodes[context.dp.offset]);
          return true;
        }
      }
    },


    // default split node will clone itself and move content
    // from one side of the context.dp to the new node and return a fragment
    // with the new split node.
    splitNode: function(context) {
      // clone ourselves, so that we maintain the same styling
      var frag = document.createDocumentFragment();
      var newNode = this.cloneNode();
      frag.appendChild(newNode);

      this.moveChildren_(newNode, context.dp);
      return frag;
    },


    // reusable method to move child nodes from this to newNode
    moveChildren_: function(newNode, domPosition) {
      for (var i = domPosition.offset; i < this.childNodes.length; i++) {
        var childToMove = this.childNodes[i];
        if (newNode.firstChild) {
          newNode.insertBefore(childToMove, newNode.firstChild);
        } else {
          newNode.appendChild(childToMove);
        }
      }
    }

  });
  // ------------------------------------------------------


})();