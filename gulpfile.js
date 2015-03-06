var gulp = require('gulp');
var watch = require('gulp-watch');

var wiredep = require('wiredep').stream;
var connect = require('gulp-connect');
var clean = require('gulp-clean');

var coffee = require('gulp-coffee');
var uglify = require('gulp-uglifyjs');
var ngAnnotate = require('gulp-ng-annotate');

var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');

var minifyHTML = require('gulp-minify-html');

gulp.task('clean', function () {
  gulp.src('./dist')
    .pipe(clean());
});


gulp.task('connect', function () {
  connect.server({
    root: ['src', 'lib', 'dist'],
    livereload: true
  });
});


gulp.task('coffee', function() {
  gulp.src('./src/**/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(ngAnnotate())
    .pipe(uglify('alcarin.js'))
    .pipe(gulp.dest('dist/static'))
    .pipe(connect.reload());
});
gulp.task('watch-coffee', function () {
  watch('src/**/*.coffee', function () {
    gulp.start('coffee');
  });
});


gulp.task('less', function () {
  gulp.src('src/alcarin/**/*.less')
    .pipe(less({
      compress: true,
      paths: ['src/components']
    }))
    .pipe(concatCss('alcarin.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/static'))
    .pipe(connect.reload());
});
gulp.task('watch-less', function () {
  watch('src/**/*.less', function () {
    gulp.start('less');
  });
});


gulp.task('wiredep', function () {
  gulp.src('./src/index.html')
    .pipe(wiredep({
      directory: 'lib/bower',
      ignorePath: '../lib/'
    }))
    .pipe(gulp.dest('./src'))
    .pipe(connect.reload());
});
gulp.task('watch-bower', function () {
  watch('bower.json', function () {
    gulp.start('wiredep');
  });
});

gulp.task('minify-html', function() {
  return gulp.src('src/**/*.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./dist/static'))
    .pipe(connect.reload());
});
gulp.task('watch-html', function() {
  watch('src/**/*.html', function () {
    gulp.start('minify-html');
  });
});


gulp.task('build', ['clean', 'coffee', 'less', 'wiredep', 'minify-html']);

gulp.task('watch', ['watch-coffee', 'watch-less', 'watch-bower', 'watch-html']);
gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['serve']);
