var gulp = require('./gulp');
var plugins = gulp.plugins;

gulp.task('compile-js', [
    'Wrap all js files from `/src` directory in IIFE with "use strict" statement.',
    'Add AngularJS dependency injection annotations to js.',
    'Store decorated files in `/dist` directory.',
    'Reload the server.'
].join(' '), ['clean-dist-js'], function() {
    var jsSources = [
        'src/app.js',
        'src/**/*.module.js',
        'src/**/*.js'
    ];
    return gulp.src(jsSources)
        .pipe(plugins.sourcemaps.init())
            .pipe(plugins.babel())
            .pipe(plugins.wrapJs('!function(){%= body %}()'))
            .pipe(plugins.ngAnnotate())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('dist'))
        .pipe(plugins.connect.reload());
});
