var gulp = require('./gulp');
var plugins = gulp.plugins;

gulp.task('watch-styles', false, watchSassFiles);
gulp.task('compile-styles', [
    'Compile `src/assets/style/index.sass` file.',
    'Include `src/components/*` less files as less deps.',
    'Minify css and add source maps.',
    'Reload the server.'
].join(' '), compileSassStyle);

/////

function watchSassFiles() {
    plugins.watch('src/assets/style/**/*.scss', function () {
        gulp.start('compile-styles');
    });
}

function compileSassStyle() {
    var sassOptions = {
        includePaths: ['lib/bower/bootstrap-sass/assets/stylesheets']
    };
    var sassStream = gulp.src('src/assets/style/index.scss')
        .pipe(plugins.cached('compile-styles'))
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass(sassOptions))
            .pipe(plugins.autoprefixer('last 2 version'))
            .pipe(plugins.minifyCss())
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest('dist/'));

    /**
     * just tell connect server to reload css files after job is done.
     * when it get sass files on input, it reload full page,
     * css files are reload dynamically
     */
    sassStream.on('end', function () {
        return gulp.src('dist/index.css').pipe(plugins.connect.reload());
    });

    return sassStream;
}
