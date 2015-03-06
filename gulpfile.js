var modulesCache = {};
function use(module) {
  if (!(module in modulesCache)) {
    modulesCache[module] = require(module);
  }
  return modulesCache[module];
}

var gulp = require('gulp');

gulp.task('clean', function () {
  var clean = use('gulp-clean');
  gulp.src('./dist')
    .pipe(clean());
});


gulp.task('connect', function () {
  var connect = use('gulp-connect');
  connect.server({
    root: ['src', 'lib', 'dist'],
    livereload: true
  });
});


gulp.task('coffee', function() {
  var coffee = use('gulp-coffee');
  var ngAnnotate = use('gulp-ng-annotate');
  var connect = use('gulp-connect');

  gulp.src('./src/**/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(ngAnnotate())
    // .pipe(uglify('alcarin.js'))
    .pipe(gulp.dest('dist/static'))
    .pipe(connect.reload());
});
gulp.task('watch-coffee', function () {
  var watch = use('gulp-watch');
  watch('src/**/*.coffee', function () {
    gulp.start('coffee');
  });
});


gulp.task('less', function () {
  var less = use('gulp-less');
  var concatCss = use('gulp-concat-css');
  var minifyCSS = use('gulp-minify-css');
  var connect = use('gulp-connect');

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
  var watch = use('gulp-watch');
  watch('src/**/*.less', function () {
    gulp.start('less');
  });
});


gulp.task('wiredep', function () {
  var wiredep = use('wiredep').stream;
  var connect = use('gulp-connect');
  gulp.src('./src/index.html')
    .pipe(wiredep({
      directory: 'lib/bower',
      ignorePath: '../lib/'
    }))
    .pipe(gulp.dest('./src'))
    .pipe(connect.reload());
});
gulp.task('watch-bower', function () {
  var watch = use('gulp-watch');
  watch('bower.json', function () {
    gulp.start('wiredep');
  });
});

gulp.task('minify-html', function() {
  var connect = use('gulp-connect');
  var minifyHTML = use('gulp-minify-html');
  return gulp.src('src/**/*.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./dist/static'))
    .pipe(connect.reload());
});
gulp.task('watch-html', function() {
  var watch = use('gulp-watch');
  watch('src/**/*.html', function () {
    gulp.start('minify-html');
  });
});


gulp.task('build', ['clean', 'coffee', 'less', 'wiredep', 'minify-html']);

gulp.task('watch', ['watch-coffee', 'watch-less', 'watch-bower', 'watch-html']);
gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['serve']);
