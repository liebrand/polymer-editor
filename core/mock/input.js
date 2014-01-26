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

define([
  'core/mock/selection',
  'test/utils/keyCodeMap'], function(Selection, KeyCodeMap) {

  'use strict';

  var Input = function(emitter) {

    // TODO(jliebrand): should probably set the listener
    // on the <polymer-editor> ? not the document.body??
    document.body.addEventListener('keypress', function(evt) {
      console.log('keypress', evt);
      // block all normal behaviour from happening...
      evt.preventDefault();
      var letter = String.fromCharCode(evt.charCode);
      emitter.emit('insertText', {text: letter});
    });


    // TODO(jliebrand): should probably set the listener
    // on the <polymer-editor> ? not the document.body??
    document.body.addEventListener('keydown', function(evt) {
      console.log('key event hit', evt);

      // ask the Element to convert the key to an edit intent
      var editIntent;
      Selection.walkUp(function(node) {
        if (node.shortCuts) {
          // TODO(jliebrand): should really match these keys
          // better but for now, just hardcoding this...
          var shortCuts = node.shortCuts['mac'];
          for(var shortCut in shortCuts) {
            var keys = shortCut.split(' ');

            var code;
            var modifiers = {
              meta: false,
              shift: false,
              control: false
            };
            for (var j = 0; j < keys.length; j++) {
              var keyToPress = KeyCodeMap.getKeyObject(keys[j]);
              modifiers[keyToPress.keyIdentifier.toLowerCase()] = true;
              if (keyToPress.keyCode !== undefined) {
                code = keyToPress.keyCode;
              }
            }

            if (evt.keyCode === code &&
                evt.metaKey === modifiers.meta &&
                evt.shiftKey === modifiers.shift &&
                evt.ctrlKey === modifiers.control) {
              // found a match, stop the default behaviour, emit
              // the specified intent and break out of
              // the selection.walkUp by returning true;
              evt.preventDefault();
              var intentDef = shortCuts[shortCut];
              emitter.emit(intentDef.editIntent, intentDef.context);
              return true;
            }
          }
        }
      });
      // switch (evt.keyCode) {
      //   case 8:
      //     evt.preventDefault();
      //     var context = {};
      //     context.direction = evt.shiftKey ? 'forward' : 'backward';

      //     // TODO(jliebrand): this behaviour should be definable
      //     // by the app... but how??
      //     // hack, this locale specific word boundary should
      //     // be handled elsewhere; although app should be able
      //     // to specify; think sublime ctrl-delete camelCase
      //     context.granularity = evt.metaKey ? 'word' : 'character';
      //     emitter.emit('delete', context);

      //     break;
      //   case 13:
      //     evt.preventDefault();
      //     emitter.emit('splitTree');
      //     break;

      //   default:
      //     break;
      // }
    });
  };

  return Input;
});

