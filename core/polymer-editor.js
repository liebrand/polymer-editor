
(function() {

  Polymer('polymer-editor', {

    name: '',

    ready: function() {
    },

    enteredView: function() {
      this.emitter_ = new Emitter();
      this.input_ = new Input(this.emitter_);


      /**
       * JELTE TODO WRITE ME
       *
       * @param {boolean} name argument for x y z
       */
      this.emitter_.on('insertText', function(context) {

        context.node = document.createTextNode(context.text);
        context.ip = Selection.guaranteeElementDomPosition();

        if (context.ip && context.ip.container) {

          if (context.ip.container.supports &&
              context.ip.container.supports('insertNode', context)) {
            context.ip.container.insertNode(context);

            // hack to move the selection - this should be handled
            // differently so this core edit can remain oblivious
            // to selection!
            for (var i = 0; i < context.text.length; i++) {
              getSelection().modify('move', 'forward', 'character');
            }
          }
          context.ip.container.normalize();
        }
      });


      /**
       * JELTE TODO WRITE ME
       *
       * @param {boolean} name argument for x y z
       */
      this.emitter_.on('delete', function(context) {
        // TODO(jliebrand): this SHOULD also merge, for now only doing text, but
        // if IP is inside TEXT_NODE, then split in three and ask parent to delete middle node
        // else findLeftLeafDomPosition (starting at prev sibling)
        //      if leftLeaf is TN -> split final char, delete final-char-tn
        //      else delete leftLeaf
        //      UNLESS we find MERGE-on-boundary-cross returned by elements during findLeftLeaf


        // hack; who decides word boundaries? think about sublime use case!
        // ip.container.parentNode.getWordBoundaries() ??
        var WORDLENGTH = 4;

        var caretOffset = context.direction === 'forward' ? 0 :
          context.amount === 'word' ? -WORDLENGTH : -1;;

        context.ip = Selection.domPosition();
        if (context.ip) {
          if (context.ip.container.nodeType === Node.TEXT_NODE) {
            // transform the selection and dom tree, such that
            // we can tell the relevant elements to delete their children
            // eg, abstract TEXT_NODEs away from elements...
            var length = context.amount === 'word' ? WORDLENGTH : 1;
            var offset = context.direction === 'forward' ?
                context.ip.offset : context.ip.offset - length;

            var tnOffset = DomUtils.splitText(context.ip.container, offset, length);
            context.ip.container = context.ip.container.parentNode;
            context.ip.offset = tnOffset;

            Selection.setDomPosition(context.ip);

          }
          if (context.ip.container.supports('deleteNode', context)) {
            context.ip.container.deleteNode(context);
          }
          context.ip.container.normalize();
        }

      });



    },
  });
  // ------------------------------------------------------


})();
