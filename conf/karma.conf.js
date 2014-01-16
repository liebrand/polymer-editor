module.exports = function(karma) {
  var common = require('../../tools/test/karma-common.conf.js');
  karma.set(common.mixin_common_opts(karma, {
    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    // list of files / patterns to load in the browser
    files: [
      'tools/test/mocha-htmltest.js',
      'tools/test/chai/chai.js',
      'polymer-editor/conf/mocha.conf.js',

      // serve and load our tests
      'polymer-editor/test/js/*.js',

      // make sure the karma server serves up the other files we need
      {pattern: 'platform/**/*', included: false},
      {pattern: 'polymer/**/*', included: false},
      {pattern: 'tools/**/*.js', included: false},
      {pattern: 'polymer-editor/**/*', included: false}
    ],

    // list of files to exclude
    exclude: [
    ],
  }));
};
