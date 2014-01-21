
console.log('1');

require([
  'core/events/emitter',
  'core/mock/input',
  'core/mock/selection'
], function(
  Emitter,
  Input,
  Selection) {
console.log(Emitter, Input, Selection);

  Polymer('polymer-editor', {

    name: '',

    ready: function() {}
  });

    // enteredView: function() {
    //   this.emitter_ = new Emitter();
    //   this.input_ = new Input(this.emitter_);


    //   /**
    //    * JELTE TODO WRITE ME
    //    *
    //    * @param {boolean} name argument for x y z
    //    */
    //   this.emitter_.on('insertText', function(context) {

    //     context.node = document.createTextNode(context.text);
    //     context.ip = Selection.guaranteeElementDomPosition();

    //     if (context.ip && context.ip.container) {

    //       if (context.ip.container.supports &&
    //         context.ip.container.supports('insertNode', context)) {
    //         context.ip.container.insertNode(context);

    //         // hack to move the selection - this should be handled
    //         // differently so this core edit can remain oblivious
    //         // to selection!
    //         for (var i = 0; i < context.text.length; i++) {
    //           getSelection().modify('move', 'forward', 'character');
    //         }
    //       }
    //       context.ip.container.normalize();
    //     }
    //   });


    //   /**
    //    * JELTE TODO WRITE ME
    //    *
    //    * @param {boolean} name argument for x y z
    //    */
    //   this.emitter_.on('delete', function(context) {

    //     // hack; who decides word boundaries? think about sublime use case!
    //     // ip.container.parentNode.getWordBoundaries() ??
    //     var WORDLENGTH = 4;
    //     var caretOffset = context.direction === 'forward' ? 0 :
    //       context.amount === 'word' ? -WORDLENGTH : -1;;

    //     var dp = Selection.startDomPosition();

    //     // step 1 - if inside text node; then delete text
    //     if (dp.insideTextNode) {
    //       var parentElement = dp.container.parentNode;
    //       if (supports_(parentElement, 'deleteNode')) {
    //         deleteTextInNode();
    //       }
    //     } else {
    //       // step 2 - get left/right leaf and determine if we need to merge
    //       var merge = false;
    //       var left = dp.leftLeaf();
    //       var right = dp.rightLeaf();
    //       DomUtils.reverseInOrder({
    //         start: right,
    //         end: left,
    //         inclusive: false,
    //         callback: function(node) {
    //           merge = merge || (node.supports && node.supports('mergeOnCrossingBoundary'))
    //         }
    //       });
    //       if (merge) {
    //         // been told to merge the nodes due to crossing boundary; merge
    //         // the nodes and then delete empty tree branches
    //         if (left.supports && left.supports('mergeNode', right)) {
    //           var rightParent = right.parentNode;
    //           left.mergeNode(right);
    //           DomUtils.deleteEmptyTree(rightParent);
    //         }
    //       } else {
    //         if (left.nodeType === Node.TEXT_NODE) {
    //           // left leaf is text; delete text inside of it
    //           deleteTextInNode(left);
    //         } else {
    //           // left leaf is element, delete it (if parent supports it)
    //           var leftParent = left.parentNode;
    //           var offset = DomUtils.indexOf(left)
    //           if (leftParent.supports && leftParent.supports('deleteNode', offset)) {
    //             leftParent.deleteNode(offset);
    //           }
    //         }
    //       }
    //     }



    //     // context.ip = Selection.domPosition();
    //     // if (context.ip) {
    //     //   if (context.ip.container.nodeType === Node.TEXT_NODE) {
    //     //     // transform the selection and dom tree, such that
    //     //     // we can tell the relevant elements to delete their children
    //     //     // eg, abstract TEXT_NODEs away from elements...
    //     //     var length = context.amount === 'word' ? WORDLENGTH : 1;
    //     //     var offset = context.direction === 'forward' ?
    //     //         context.ip.offset : Math.max(0, context.ip.offset - length);

    //     //     var tnOffset = DomUtils.splitText(context.ip.container, offset, length);
    //     //     context.ip.container = context.ip.container.parentNode;
    //     //     context.ip.offset = tnOffset;

    //     //     Selection.setDomPosition(context.ip);

    //     //   }
    //     //   if (context.ip.container.supports &&
    //     //       context.ip.container.supports('deleteNode', context)) {
    //     //     context.ip.container.deleteNode(context);
    //     //   }
    //     //   context.ip.container.normalize();
    //     // }

    //   });



  //   },
  // });


});