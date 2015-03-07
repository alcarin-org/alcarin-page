var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  pattern: '*',
  lazy: true
});

gulp.task('clean', function () {
  return gulp.src('./dist')
    .pipe(plugins.clean());
});


gulp.task('connect', function () {
  plugins.connect.server({
    root: ['src', 'lib', 'dist'],
    livereload: true
  });
});


gulp.task('js', function() {
  return gulp.src(['src/app.js', 'src/**/*.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.wrap('(function(){\n\'use strict\';\n<%= contents %>\n})();'))
    // .pipe(plugins.coffee({
    //   bare: false
    // }))
    .pipe(plugins.ngAnnotate({
      single_quotes: true
    }))
    .pipe(plugins.concat('alcarin.js'))
    // uglify should be reenabled when I done rewriting code to pure js
    // .pipe(plugins.uglifyjs('alcarin.js'))
    .pipe(gulp.dest('dist/static'))
    .pipe(plugins.connect.reload());
});
gulp.task('watch-js', function () {
  plugins.watch('src/**/*.js', function () {
    gulp.start('js');
  });
});


gulp.task('less', function () {
  return gulp.src('src/alcarin/**/*.less')
    .pipe(plugins.plumber())
    .pipe(plugins.less({
      compress: true,
      paths: ['src/components']
    }))
    .pipe(plugins.concatCss('alcarin.css'))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest('dist/static'))
    .pipe(plugins.connect.reload());
});
gulp.task('watch-less', function () {
  plugins.watch('src/**/*.less', function () {
    gulp.start('less');
  });
});


gulp.task('wiredep', function () {
  return gulp.src('./src/index.html')
    .pipe(plugins.plumber())
    .pipe(plugins.wiredep.stream({
      directory: 'lib/bower',
      ignorePath: '../lib/'
    }))
    .pipe(gulp.dest('./src'))
    .pipe(plugins.connect.reload());
});
gulp.task('watch-bower', function () {
  plugins.watch('bower.json', function () {
    gulp.start('wiredep');
  });
});

gulp.task('minify-html', function() {
  return gulp.src('src/**/*.html')
    .pipe(plugins.plumber())
    .pipe(plugins.minifyHtml())
    .pipe(gulp.dest('./dist/static'))
    .pipe(plugins.connect.reload());
});
gulp.task('watch-html', function() {
  plugins.watch('src/**/*.html', function () {
    gulp.start('minify-html');
  });
});


gulp.task('build', function (cb) {
  plugins.runSequence('clean', [
    'js', 'less', 'wiredep', 'minify-html'
  ], cb);
});

gulp.task('watch', ['watch-js', 'watch-less', 'watch-bower', 'watch-html']);
gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['serve']);
