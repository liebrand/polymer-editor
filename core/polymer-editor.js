
(function() {

  Polymer('polymer-editor', {

    name: '',

    ready: function() {
    },

    enteredView: function() {
      this.emitter_ = new Emitter();
      this.input_ = new Input(this.emitter_);


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

    },
  });
  // ------------------------------------------------------


})();
