/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview simple layman version of nodejs event emitter
 *
 * NOTE: this is really crude; no unsubscribe or "once" functions or
 * anything... just enough to do the POC
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var Emitter = function() {
    this.registry_ = {};
  };

  Emitter.prototype = {
    on: function(eventName, callback) {
      this.registry_[eventName] = this.registry_[eventName] || [];
      this.registry_[eventName].push(callback);
    },

    emit: function(eventName, data) {
      var callbacks = this.registry_[eventName];
      if (callbacks) {
        callbacks.forEach(function(callback) {
          callback.call(this, data);
        })
      }
    }
  };

  return Emitter;
});

