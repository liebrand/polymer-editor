// Copyright 2013 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

module.exports = function(grunt) {

  var srcFiles = [
    'core/**/*.js',
    'test/**/*.js'
    ];


  grunt.initConfig({
    karma: {
      options: {
        configFile: 'conf/karma.conf.js',
        keepalive: true
      },
      buildbot: {
        reporters: ['crbot'],
        logLevel: 'OFF'
      },
      'polymer-editor': {
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: 'customJsHintReporter.js',
        debug: true
      },
      all: {
        src: srcFiles
      }
    },
    watch: {
      all: {
        files: srcFiles,
        tasks: ['newer:jshint:all']
      }
    }
  });

  grunt.loadTasks('../tools/tasks');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('default', 'test');
  grunt.registerTask('test', ['override-chrome-launcher', 'karma:polymer-editor']);
  grunt.registerTask('lint', ['jshint:all']);
};
