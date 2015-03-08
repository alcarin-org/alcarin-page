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
    livereload: true,
    middleware: function() {
      return [plugins.connectHistoryApiFallback];
    }
  });
});

gulp.task('clean-dist-js', function () {
  gulp.src('dist/static/**/*.js')
    .pipe(plugins.clean());
});
gulp.task('compile-js', ['clean-dist-js'], function() {
  return gulp.src(['src/app.js', 'src/**/*.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.wrap('!function(){\n\'use strict\';\n<%= contents %>\n}()'))
    .pipe(plugins.ngAnnotate())
    .pipe(gulp.dest('dist/static'))

    .pipe(plugins.connect.reload());
});
gulp.task('compile-js-and-inject-deps', ['compile-js'], function () {
  // It's not necessary to read the files (will speed up things),
  // we're only after their paths:
  var bus = gulp.src('./dist/static/components/events-bus.js');
  var sources = gulp.src(
    ['./dist/static/**/*.js']
  )
  .pipe(plugins.angularFilesort());

  return gulp.src('./src/index.html')
    .pipe(plugins.inject(plugins.eventStream.merge(
        sources,
        bus
      ), {
      ignorePath: '/dist'
    }))
    .pipe(gulp.dest('./src'));
});
gulp.task('watch-js', function () {
  plugins.watch('./src/**/*.js', function () {
    gulp.start('compile-js-and-inject-deps');
  });
});

gulp.task('js-prod', function() {
  return gulp.src(['src/app.js', 'src/**/*.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.wrap('!function(){\n\'use strict\';\n<%= contents %>\n}()'))
    .pipe(plugins.ngAnnotate())
    // uglify should be reenabled when I done rewriting code to pure js
    .pipe(plugins.uglify())
    .pipe(plugins.concat('alcarin.js'))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/static'))
    .pipe(plugins.connect.reload());
});


gulp.task('less', function () {
  return gulp.src('src/alcarin/**/*.less')
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less({
      compress: true,
      paths: ['src/components']
    }))
    // .pipe(plugins.concatCss('alcarin.css'))
    .pipe(plugins.minifyCss())
    .pipe(plugins.concat('alcarin.css'))
    .pipe(plugins.sourcemaps.write('./'))
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
    'js-prod', 'less', 'wiredep', 'minify-html'
  ], cb);
});

gulp.task('serve', function (cb) {
  plugins.runSequence(
    ['connect', 'compile-js-and-inject-deps'],
    'watch',
    cb
  );
});

gulp.task('watch', [
  'watch-js', 'watch-less', 'watch-bower', 'watch-html'
]);
// gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['serve']);
