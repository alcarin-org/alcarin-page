"use strict"

module.exports = (grunt)->
    modules = ['grunt-contrib-watch', 'grunt-newer', 'grunt-contrib-coffee', 'grunt-contrib-less',
               'grunt-contrib-htmlmin', 'grunt-nodemon', 'grunt-concurrent']

    grunt.loadNpmTasks(module) for module in modules

    grunt.initConfig
        pkg: grunt.file.readJSON('package.json')
        watch:
            options:
                livereload: true
            grunt:
                files: 'Gruntfile.coffee'
            htmlmin:
                files: 'src/**/*.html'
                tasks: ['newer:htmlmin:min']
            coffee:
                files: 'src/**/*.coffee'
                tasks: ['newer:coffee:compile']
            less:
                options:
                    livereload: false
                files: 'src/**/*.less'
                tasks: ['newer:less:compile']
            css:
                files: 'public/**/*.css'
        coffee:
            compile:
                options:
                    sourceMap: true
                expand: true
                flatten: false
                cwd: 'src/'
                src: '**/*.coffee'
                dest: 'public/'
                ext: '.js'
        less:
            compile:
                files: [
                    expand: true,
                    cwd: 'src/',
                    src: '**/*.less',
                    dest: 'public/',
                    ext: '.css'
                ]
        htmlmin:
            min:
                options:
                    removeComments: true
                    collapseWhitespace: true
                files: [
                    expand: true,
                    cwd: 'src/',
                    src: '**/*.html',
                    dest: 'public/',
                    ext: '.html'
                ]
        nodemon:
            dev:
                options:
                    logConcurrentOutput: true
                script: 'index.coffee'
        concurrent:
            dev:
                tasks: ['nodemon', 'watch'],
                options:
                    logConcurrentOutput: true

    grunt.registerTask('build', ['coffee', 'less', 'htmlmin'])
    grunt.registerTask('run', ['concurrent'])
    grunt.registerTask('default', ['run'])
