var gulp = require('./gulp');
var plugins = gulp.plugins;

gulp.task('clean-dist-js', 'Delete all js files from `/dist` directory.', cleanJs);

gulp.task('compile-scripts', [
    'Wrap all js files from `/src` directory in IIFE with "use strict" statement.',
    'Add AngularJS dependency injection annotations to js.',
    'Store decorated files in `/dist` directory.',
    'Reload the server.'
].join(' '), ['clean-dist-js'], compileScripts);

gulp.task('watch-scripts', false, watchScripts);


gulp.task('compile-and-inject-deps', [
    'Run "compile-scripts" and "compile-styles" task,',
    'then inject output js and css files to `src/index.html`.',
    'Take care of angular.js file order rules.'
  ].join(' '), ['compile-scripts', 'compile-styles'], compileAndInjectScripts);

function compileAndInjectScripts() {
  var jsSources = gulp.src([
      'dist/**/*.preload.js',
      'dist/**/*.module.js',
      'dist/alcarin.module.js',
      'dist/**/*.js'
  ], {read: false});
  var cssSources = gulp.src('./dist/**/*.css', {read: false});

  return gulp.src('./src/index.html')
    .pipe(plugins.inject(jsSources, {
      ignorePath: '/dist'
    }))
    .pipe(plugins.inject(cssSources, {
      ignorePath: '/dist'
    }))
    .pipe(gulp.dest('./src'))
    .pipe(plugins.connect.reload());
}

function cleanJs() {
  return gulp.src('dist/**/*.js')
    .pipe(plugins.cached('compile-scripts'))
    .pipe(plugins.clean());
}

function compileScripts() {
    var jsSources = [
        'src/alcarin.module.js',
        'src/**/*.module.js',
        'src/**/*.js'
    ];
    return gulp.src(jsSources)
        .pipe(plugins.cached('compile-scripts'))
        .pipe(plugins.sourcemaps.init())
            .pipe(plugins.babel())
            .pipe(plugins.wrapJs('!function(){%= body %}()'))
            .pipe(plugins.ngAnnotate())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('dist'));
}

function watchScripts() {
  plugins.watch('./src/**/*.js', function () {
    gulp.start('compile-and-inject-deps');
  });
}
