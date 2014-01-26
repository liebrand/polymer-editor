

define([], function() {

    'use strict';

    // Alias and short names.
    var aliases_ = {
      '↵': 'enter',
      '\n': 'enter',
      'return': 'enter',
      ' ': 'space',
      '⇥': 'tab',
      '\t': 'tab',
      '⟵': 'backspace',
      '⇧': 'shift',
      'ctrl': 'control',
      '⌥': 'alt',
      '⌘': 'command',
      'cmd': 'command',
      'win': 'windows',
      '↑': 'up',
      '↓': 'down',
      '←': 'left',
      '→': 'right',
      '⇞': 'page up',
      'pgup': 'page up',
      '⇟': 'page down',
      'pgdn': 'page down',
      'esc': 'escape'
    };


    // Iterator variable.
    var c;
    // List of characters for programatically adding data.
    var chars_ = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '+', '-', '=', '*', '%', '^', '$', '£', '€', '!', '?', '@', '&',
      '|', '.', ',', ';', ':', '`', '~', '-', '_',
      '(', ')', '[', ']', '{', '}', '<', '>',
      '/', '\\', "'", '"'
    ];
    // Character codes.
    var charCodes_ = {
      'backspace': 0,
      'tab': 9,
      'enter': 13,
      'shift': 0,
      'control': 0,
      'alt': 0,
      'escape': 0,
      'space': 32,
      'page up': 0,
      'page down': 0,
      'left': 0,
      'up': 0,
      'right': 0,
      'down': 0,
      'delete': 0,
      'meta': 0
    };

    // Browser specific key codes.
    var keyCodes_ = {
      'backspace': 8,
      'tab': 9,
      'enter': 13,
      'shift': 16,
      'control': 17,
      'alt': 18,
      'escape': 27,
      'space': 32,
      'page up': 33,
      'page down': 34,
      'left': 37,
      'up': 38,
      'right': 39,
      'down': 40,
      'delete': 46,
      'meta': 91,
      '0': 48, ')': 48, '1': 49, '!': 49, '2': 50, '@': 50, '€': 50,
      '3': 51, '#': 51, '£': 51, '4': 52, '$': 52, '5': 53, '%': 53,
      '6': 54, '^': 54, '7': 55, '&': 55, '8': 56, '*': 56, '9': 57,
      '(': 57, 'a': 65, 'A': 65, 'b': 66, 'B': 66, 'c': 67, 'C': 67,
      'd': 68, 'D': 68, 'e': 69, 'E': 69, 'f': 70, 'F': 70, 'g': 71,
      'G': 71, 'h': 72, 'H': 72, 'i': 73, 'I': 73, 'j': 74, 'J': 74,
      'k': 75, 'K': 75, 'l': 76, 'L': 76, 'm': 77, 'M': 77, 'n': 78,
      'N': 78, 'o': 79, 'O': 79, 'p': 80, 'P': 80, 'q': 81, 'Q': 81,
      'r': 82, 'R': 82, 's': 83, 'S': 83, 't': 84, 'T': 84, 'u': 85,
      'U': 85, 'v': 86, 'V': 86, 'w': 87, 'W': 87, 'x': 88, 'X': 88,
      'y': 89, 'Y': 89, 'z': 90, 'Z': 90, ';': 186, ':': 186, '=': 187,
      '+': 187, ',': 188, '<': 188, '-': 189, '_': 189, '.': 190,
      '>': 190, '/': 191, '?': 191, '`': 192, '~': 192, '[': 219,
      '{': 219, '\\': 220, '|': 220, ']': 221, '}': 221, "'": 222, '"': 222
    };

    // Key identifiers.
    var keyIds_ = {
      'backspace': 'U+0008',
      'tab': 'U+0009',
      'enter': 'Enter',
      'shift': 'Shift',
      'control': 'Control',
      'alt': 'Alt',
      'escape': 'U+001B',
      'space': 'U+0020',
      'page up': 'PageUp',
      'page down': 'PageDown',
      'left': 'Left',
      'up': 'Up',
      'right': 'Right',
      'down': 'Down',
      'delete': 'U+007F',
      'meta': 'Meta',
      'command': 'Meta'
    };

    function makeUnicodeId_(keyCode) {
      return 'U+' + ('0000' + keyCode.toString(16)).toUpperCase().substr(-4);
    }

    // The text input value to use, true to use the key name.
    var textInput_ = {
      'meta': false
    };

    // add codes for all characters
    for (c = 0; c < chars_.length; c++) {
      charCodes_[chars_[c]] = chars_[c].charCodeAt(0);
      textInput_[chars_[c]] = true;
      keyIds_[chars_[c]] = makeUnicodeId_(charCodes_[chars_[c]]);
    }

    return {
      platform: 'OSX',
      locale: 'EN',
      charCodes: charCodes_,
      keyCodes: keyCodes_,
      keyIds: keyIds_,
      textInput: textInput_,
      which: keyCodes_,
      parseAlias: function(alias) {
        return aliases_[alias] || alias;
      },
      getKeyObject: function(keyName) {
        var name = this.parseAlias(keyName);
        return {
          name: name,
          textInput: textInput_[name],
          charCode: charCodes_[name],
          keyCode: keyCodes_[name],
          keyIdentifier: keyIds_[name],
          which: keyCodes_[name]
        };
      }
    };

});

