var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  config: process.cwd() + '/package.json',
  pattern: '*',
  lazy: true
});

var gulpWithHelp = require('gulp-help')(gulp);
gulpWithHelp.plugins = plugins;

module.exports = gulpWithHelp;
