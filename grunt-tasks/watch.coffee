module.exports = exports =
    options:
        livereload: true
    grunt:
        files: ['Gruntfile.coffee', 'grunt-tasks/*.coffee']
        options:
            reload: true
            livereload: false
        tasks: ['build']
    htmlmin:
        files: 'src/**/*.html'
        tasks: ['newer:htmlmin:min']
    coffee_index:
        # we dont livereload browser after compiling vendor file - cauze it need be
        # processed by browserify first
        options:
            livereload: false
        files: 'src/vendor.coffee'
        tasks: 'coffee:compile_index'
    browserify_index:
        files: 'dist/vendor.tmp.js'
        tasks: ['browserify:build_index_js']
    coffee:
        files: ['src/app.coffee', 'src/alcarin/**/*.coffee']
        tasks: ['newer:coffee:compile']
    less:
        options:
            livereload: false
        files: 'src/**/*.less'
        tasks: ['newer:less:compile']
    css:
        files: "dist/**/*.css"
