module.exports = exports =
    options:
        livereload: true
    grunt:
        files: ['Gruntfile.coffee', 'grunt-tasks/*.coffee']
        options:
          reload: true
    htmlmin:
        files: 'src/**/*.html'
        tasks: ['newer:htmlmin:min']
    coffee:
        files: 'src/**/*.coffee'
        tasks: ['newer:coffee:compile_index', 'newer:coffee:compile']
    less:
        options:
            livereload: false
        files: 'src/**/*.less'
        tasks: ['newer:less:compile']
    css:
        files: "dist/**/*.css"
    browserify_index:
        files: 'src/index.coffee'
        tasks: ['newer:browserify:build_index_js']
