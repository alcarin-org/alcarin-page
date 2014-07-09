module.exports = exports =
    options:
        livereload: true
    grunt:
        files: ['Gruntfile.coffee', 'grunt-tasks/*.coffee']
        options:
            reload: true
            livereload: false
    htmlmin:
        files: 'src/**/*.html'
        tasks: ['newer:htmlmin:min']
    coffee_index:
        # we dont livereload browser after compiling vendor file - cauze it need be
        # processed by browserify first
        options:
            livereload: false
        files: 'src/vendor.coffee'
        tasks: 'newer:coffee:compile_index'
    browserify_index:
        files: 'dist/vendor.js'
        tasks: ['newer:browserify:build_index_js']
    coffee:
        files: 'src/alcarin/**/*.coffee'
        tasks: ['newer:coffee:compile']
    less:
        options:
            livereload: false
        files: 'src/**/*.less'
        tasks: ['newer:less:compile']
    css:
        files: "dist/**/*.css"
