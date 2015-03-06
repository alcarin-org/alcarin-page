var gulp = require('gulp');
var watch = require('gulp-watch');

var wiredep = require('wiredep').stream;
var connect = require('gulp-connect');

var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');

gulp.task('connect', function () {
  connect.server({
    root: ['src', 'lib', 'dist'],
    livereload: true
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
    .pipe(gulp.dest('./src'));
});
gulp.task('watch-bower', function () {
  watch('bower.json', function () {
    gulp.start('wiredep');
  });
});


gulp.task('build', ['less', 'wiredep']);

gulp.task('watch', ['watch-less', 'watch-bower']);
gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['serve']);
