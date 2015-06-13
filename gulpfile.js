var gulp = require('./gulp-tasks/gulp');

require('./gulp-tasks');

var plugins = gulp.plugins;

gulp.task('clean', 'Delete `/dist` directory.', function () {
  return gulp.src('./dist')
    .pipe(plugins.clean());
});

gulp.task('connect', [
    'Serve `/lib` and `/dist` directories.',
    'Redirect all requests to `/dist/index.html`.',
    'Inject livereload script to page.'
  ].join(' '), function () {
  plugins.connect.server({
    root: ['lib', 'dist'],
    livereload: true,
    middleware: function() {
      return [plugins.connectHistoryApiFallback()];
    }
  });
});

gulp.task('clean-dist-js', 'Delete all js files from `/dist` directory.', function () {
  gulp.src('dist/**/*.js')
    .pipe(plugins.clean());
});
gulp.task('compile-js', [
    'Wrap all js files from `/src` directory in IIFE with "use strict" statement.',
    'Add AngularJS dependency injection annotations to js.',
    'Store decorated files in `/dist` directory.',
    'Reload the server.'
  ].join(' '), ['clean-dist-js'], function() {
  return gulp.src(['src/app.js', 'src/**/*.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.wrap('!function(){\n\'use strict\';\n<%= contents %>\n}()'))
    .pipe(plugins.ngAnnotate())
    .pipe(gulp.dest('dist'))

    .pipe(plugins.connect.reload());
});

gulp.task('compile-and-inject-deps', [
    'Run "compile-js" and "compile-styles" task,',
    'then inject output js and css files to `src/index.html`.',
    'Take care of angular.js file order rules.'
  ].join(' '), ['compile-js', 'compile-styles'], function () {
  var jsSources = gulp.src([
      'dist/*/**/*.preload.js',
      'dist/*/**/*.module.js',
      'dist/**/*.js'
  ]);
  var cssSources = gulp.src('./dist/**/*.css');

  return gulp.src('./src/index.html')
    .pipe(plugins.inject(jsSources, {
      ignorePath: '/dist'
    }))
    .pipe(plugins.inject(cssSources, {
      ignorePath: '/dist'
    }))
    .pipe(gulp.dest('./src'));
});
gulp.task('watch-js', false, function () {
  plugins.watch('./src/**/*.js', function () {
    gulp.start('compile-and-inject-deps');
  });
});

// gulp.task('js-prod', function() {
//   return gulp.src(['src/app.js', 'src/**/*.js'])
//     .pipe(plugins.plumber())
//     .pipe(plugins.sourcemaps.init())
//     .pipe(plugins.wrap('!function(){\n\'use strict\';\n<%= contents %>\n}()'))
//     .pipe(plugins.ngAnnotate())
//     // uglify should be reenabled when I done rewriting code to pure js
//     .pipe(plugins.uglify())
//     .pipe(plugins.concat('alcarin.js'))
//     .pipe(plugins.sourcemaps.write('./'))
//     .pipe(gulp.dest('dist'))
//     .pipe(plugins.connect.reload());
// });



gulp.task('wiredep', [
  'Inject bower deps to `/src/index.html` file.',
  'Reload the server.'
  ].join(' '), function () {
  return gulp.src('./src/index.html')
    .pipe(plugins.plumber())
    .pipe(plugins.wiredep.stream({
      directory: 'lib/bower',
      ignorePath: '../lib/'
    }))
    .pipe(gulp.dest('./src'))
    .pipe(plugins.connect.reload());
});
gulp.task('watch-bower', false, function () {
  plugins.watch('bower.json', function () {
    gulp.start('wiredep');
  });
});

gulp.task('minify-index', 'Minify `src/index.html` file.', function() {
  return gulp.src('src/index.html')
    .pipe(plugins.plumber())
    .pipe(plugins.minifyHtml())
    .pipe(gulp.dest('./dist'));
});
gulp.task('minify-html', [
    'Run "minify-index" task',
    'Minify all html templates from `src/alcarin`',
    'and save as angular js `templates.js` file.',
    'Reload the server.',
  ].join(' '), ['minify-index'], function() {
  return gulp.src('src/*/**/*.html')
    .pipe(plugins.angularTemplatecache({
      module: 'alcarin-html-templates',
      standalone: true
    }))
    .pipe(gulp.dest('./dist/alcarin'))
    .pipe(plugins.connect.reload());
});
gulp.task('watch-html', false, function() {
  plugins.watch('src/**/*.html', function () {
    gulp.start('minify-html');
  });
});


gulp.task('build', [
    'Rebuild js files, sass files, inject deps.'
  ].join(' '), function (cb) {
  plugins.runSequence('clean', [
    'compile-and-inject-deps', 'wiredep', 'minify-html'
  ], cb);
});

gulp.task('serve', [
    'Run "connect" task, compile and inject deps.',
    'Watch for changes and reload the server when something happen.'
  ].join(' '), function (cb) {
  plugins.runSequence(
    ['connect', 'compile-and-inject-deps', 'minify-html'],
    'watch',
    cb
  );
});

gulp.task('watch', false, [
  'watch-js', 'watch-styles', 'watch-bower', 'watch-html'
]);
// gulp.task('serve', ['connect', 'watch']);
gulp.task('default', 'Just run "serve" task', ['serve']);
