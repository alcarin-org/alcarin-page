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
