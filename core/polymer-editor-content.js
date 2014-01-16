(function() {

  Polymer('polymer-editor-content', {

    name: '',

    ready: function() {},

    enteredView: function() {},

    supports: function(editIntent, context) {
      switch (editIntent) {
        case 'insertNode':
          return true;
          break;
        default:
          return false;
          break;
      }
    },

    insertNode: function(context) {
      if (context.ip) {
        if (this === context.ip.container) {
          // insert the node
          var sibling = this.childNodes[context.ip.offset];
          if (sibling) {
            this.insertBefore(context.node, sibling);
          } else {
            this.appendChild(context.node);
          }
          return true;
        }
      }
    }

  });
  // ------------------------------------------------------


})();