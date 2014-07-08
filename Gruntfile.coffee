"use strict"

module.exports = (grunt)->
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-newer')
    grunt.loadNpmTasks('grunt-contrib-coffee')
    grunt.loadNpmTasks('grunt-contrib-less')

    grunt.initConfig
        pkg: grunt.file.readJSON('package.json')
        watch:
            grunt:
                files: 'Gruntfile.coffee'
            html:
                options:
                  livereload: true
                files: 'src/**/*.html'
            coffee:
                options:
                  livereload: true
                files: 'src/**/*.coffee'
                tasks: ['newer:coffee:compile']
            less:
                options:
                  livereload: true
                files: 'src/**/*.less'
                tasks: ['newer:less:compile']
        coffee:
            compile:
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


    grunt.registerTask('default', ['watch'])
    grunt.registerTask('build', ['coffee', 'less'])
