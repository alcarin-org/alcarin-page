"use strict"

module.exports = (grunt)->
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-newer')
    grunt.loadNpmTasks('grunt-contrib-coffee')
    grunt.loadNpmTasks('grunt-contrib-less')

    grunt.initConfig
        pkg: grunt.file.readJSON('package.json')
        watch:
            options:
              livereload: true
            grunt:
                files: 'Gruntfile.coffee'
            html:
                files: 'src/**/*.html'
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
