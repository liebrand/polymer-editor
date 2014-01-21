"use strict";

var grunt = require('grunt');
var jshint = require('./node_modules/grunt-contrib-jshint/tasks/lib/jshint');
jshint = jshint.init(grunt);

module.exports = {

  reporter: function(result, data) {
    grunt.event.emit('jshint', result, data);
    jshint.reporter(result, data);

    if (result.length === 0) {
      grunt.log.ok(data.length + ' file' +
          (data.length === 1 ? '' : 's') + ' lint free.');
    } else {
      grunt.log.fail('LINT ERRORS');
    }
  }

};