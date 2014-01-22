(function() {

  Polymer('polymer-editor-content', {

    name: '',

    ready: function() {},

    enteredView: function() {},

    supports: function(editIntent, context) {
      switch (editIntent) {
        case 'insertNode':
        case 'deleteNode':
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
    }

  });
  // ------------------------------------------------------


})();