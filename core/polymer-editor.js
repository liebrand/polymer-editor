require([
  'core/utils/preOrderIter',
  'core/utils/domUtils',
  'core/utils/domPosition',
  'core/events/emitter',
  'core/mock/input',
  'core/mock/selection'
], function(
  PreOrderIter,
  DomUtils,
  DomPosition,
  Emitter,
  Input,
  Selection) {

  Polymer('polymer-editor', {

    ready: function() {},

    enteredView: function() {
      this.emitter_ = new Emitter();
      this.input_ = new Input(this.emitter_);


      /**
       * Handle 'insertText' edit intent
       * Algorithm:
       *   1- if inside text node: split
       *   2- create new TEXT_NODE for new text
       *   3- if DomPosition.container supports insertNode(textNode):
       *      - container.insertNode(newTextNode)
       *      - (and move caret)
       *
       * @param {object} context contains contextual information:
       * @param {string} context.text the new text to insert
       */
      this.emitter_.on('insertText', function(context) {

        // add new text node to our context
        context.node = document.createTextNode(context.text);

        var dp = Selection.startDomPosition();
        if (dp) {
          if (dp.insideTextNode()) {
            var tnOffset = DomUtils.splitText(dp.container, dp.offset);
            dp = new DomPosition(dp.container.parentNode, tnOffset);
            Selection.setStartDomPosition(dp);
          }

          if (dp.container) {

            // add the DomPosition to the context, so we can pass it to
            // the various Elements
            context.dp = dp;

            // TODO(jliebrand): wrap this supports stuff up in a
            // FuncUtils.guardCall or something...
            if (context.dp.container.supports &&
              context.dp.container.supports('insertNode', context)) {

              context.dp.container.insertNode(context);

              // hack to move the selection - this should be handled
              // differently so this core edit can remain oblivious
              // to selection movement!
              tnOffset++;
              var caret = new DomPosition(dp.container.childNodes[tnOffset], 0);
              Selection.setStartDomPosition(caret);
            }
            context.dp.container.normalize();
          }

        }

      });


      /**
       * Handle 'delete' edit intent
       * Algorithm:
       *   1- if inside text node:
       *      - split and delete
       *   2- else
       *      - get right/left leaf; and walk from one to the other
       *      - if merge required:
       *        - if (leftLeaf.supports('merge', rightLeaf))
       *          - merge
       *        - else ignore
       *      - else
       *        - if (leftLeaf.isTextNode)
       *          - split and delete
       *        - else
       *          if (leftLeaf.supports('deleteMe') &&
       *              leftParent.supports('deleteChild'))
       *            - leftParent.deleteChild(leftLeaf)
       *
       *
       * @param {object} context contains contextual information:
       * @param {string} context.direction which way to delete
       * @param {string} context.granularity indicates how far to delete, which
       *                                     is ONLY used when inside text node
       *                                     eg: 'char', 'word', 'boundary'
       * @param {string} context.boundaryRegEx optional item containing a
       *                                       regex to define what boundary
       *                                       to look for (eg '\w', or '[^$]')
       *                                       (think sublime use case!)
       */
      this.emitter_.on('delete', function(context) {
        // TODO(jliebrand): Break this mamoth function up in smaller bits!

        // TODO(jliebrand): need to support direction better; too much
        // harcoded 'left' stuff!

        // TODO(jliebrand): fix this to use context.boundaryRegEx
        var WORDLENGTH = 4;
        var length = context.direction === 'forward' ? 0 :
          context.granularity === 'word' ? WORDLENGTH : 1;

        var dp = Selection.startDomPosition();

        if (dp) {
          // normalize any stray text nodes if we got them...
          dp.container.normalize();

          // step 1 - if *inside* text node; then delete text
          if (dp.insideTextNode() && !dp.onNodeBoundary(context.direction)) {
            var parent = dp.container.parentNode;
            if (parent.supports && parent.supports('deleteNode')) {
              deleteTextInNode_(dp.container, dp.offset-length, length);
            }
          } else {
            // step 2 - get left/right leaf and determine if we need to merge
            var merge = false;
            var left = dp.leftLeaf();
            var right = dp.rightLeaf();
            var iter = new PreOrderIter(right);
            while (iter.prev() !== left) {
              if (iter.current().supports &&
                  iter.current().supports('mergeOnCrossingBoundary')) {
                if (iter.current().mergeOnCrossingBoundary()) {
                  merge = true;
                  break;
                }
              }
            }
            if (merge) {
              // been told to merge the nodes due to crossing boundary; merge
              // the nodes and then delete empty tree branches
              var dp = {};
              if (left.nodeType === Node.TEXT_NODE) {
                dp.offset = DomUtils.indexOf(left) + 1;
                left = left.parentNode;
                dp.container = left;
              }
              if (left.supports && left.supports('mergeNode', {node: right})) {
                var rightParent = right.parentNode;
                left.mergeNode({
                  node: right,
                  dp: dp
                });
                DomUtils.deleteEmptyTree(rightParent);
              }
            } else {
              if (left.nodeType === Node.TEXT_NODE) {
                // left leaf is text; delete text inside of it
                deleteTextInNode_(left, left.textContent.length-length, length);
              } else {
                // left leaf is element, delete it (if parent supports it)
                var leftParent = left.parentNode;
                var offset = DomUtils.indexOf(left)
                if (left.supports && leftParent.supports &&
                    left.supports('deleteMe') &&
                    leftParent.supports('deleteNode', offset)) {
                  leftParent.deleteNode(offset);
                }
              }
            }
          }
        }

      });

      this.emitter_.on('splitTree', function(context) {
        var dp = Selection.startDomPosition()

        if (dp.insideTextNode()) {
          var tnOffset = DomUtils.splitText(dp.container, dp.offset);
          dp = new DomPosition(dp.container.parentNode, tnOffset);
          Selection.setStartDomPosition(dp);
        }

        // keep a history of all the fragments that have been created
        // as we walk up the tree. Which allows each node to make an
        // informed decision about whether or not further splitting is
        // still required
        var history = [];

        Selection.walkUp(function(node) {

          if (node.nodeType !== Node.TEXT_NODE) {
            var splitContext = {
              history: history,
              dp: dp
            };
            if (node.supports && node.supports('splitNode', splitContext)) {

              var parent = node.parentNode;
              // TODO(jliebrand): should really pass the insertContext to
              // the parent to decide if it supports inserting that particular
              // context. But that would mean splitting node before knowing
              // if the parent can accept it. Which in turn would mean
              // reverting the split if it doesn't support it. For this POC
              // I'm cheating and just asking if the parent supports insertNode
              // in general... good enough for the POC, but this would have to
              // be made smarter in the real version...
              if (parent.supports &&
                  parent.supports('insertNode')) {

                var newFrag = node.splitNode({dp: dp});
                dp = new DomPosition(parent, DomUtils.indexOf(node) + 1);
                var insertContext ={
                  node: newFrag,
                  dp: dp
                };

                history.push(newFrag.cloneNode(true));
                parent.insertNode(insertContext);
              }

            } else {
              // stop walking the tree, we've reached the end of the nodes
              // that support splitting the tree
              return true;
            }
          }
        });
        Selection.setStartDomPosition(dp);
      });

    }

  });

  function deleteTextInNode_(tn, offset, length) {
    var parent = tn.parentNode;
    if (tn.nodeType === Node.TEXT_NODE) {
      var tnOffset = DomUtils.splitText(tn, offset, length);
      var context = {
        dp: {
          container: parent,
          offset: tnOffset
        }
      };

      Selection.setStartDomPosition(context.dp);
    }
    if (parent.supports &&
        parent.supports('deleteNode', context)) {
      parent.deleteNode(context);
    }
    parent.normalize();
  }

});


