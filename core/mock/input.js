/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview
 *
 * layman's Input to differentiate between insert/delete character
 * and split/merge tree nodes (aka splitting a paragraph when hitting a
 * carriage return)
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

window.Input = function(emitter) {

  document.body.addEventListener('keypress', function(evt) {
    // block all normal behaviour from happening...
    evt.preventDefault();
    var letter = evt.keyIdentifier;
    emitter.emit('insertText', {text: letter});
  });


  document.body.addEventListener('keydown', function(evt) {
    switch (evt.keyCode) {
      case 8:
        evt.preventDefault();
        var context = {};
        context.direction = evt.shiftKey ? 'forward' : 'backward';

        // TODO(jliebrand): this behaviour should be definable
        // by the app... but how??
        // hack, this locale specific word boundary should
        // be handled elsewhere; although app should be able
        // to specify; think sublime ctrl-delete camelCase
        context.amount = evt.metaKey ? 'word' : 'character';
        emitter.emit('delete', context);

        break;
      case 13:
        evt.preventDefault();
        emitter.emit('splitTree');
        break;

      default:
        break;
    }
  });
};