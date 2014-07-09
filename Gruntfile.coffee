"use strict"

module.exports = (grunt)->
    modules = ['grunt-contrib-watch', 'grunt-newer', 'grunt-contrib-coffee', 'grunt-contrib-less',
               'grunt-contrib-htmlmin', 'grunt-shell', 'grunt-concurrent', 'grunt-browserify',
               'grunt-contrib-clean']

    grunt.loadNpmTasks(module) for module in modules

    grunt.initConfig
        pkg: grunt.file.readJSON('package.json')
        clean:
            all: ['dist']
        watch: require './grunt-tasks/watch'
        coffee:
            options:
                sourceMap: true
                # sourceMapDir: "dist/source-maps/"
                bare: true
                join: true
            compile_index:
                files:
                    'dist/vendor.js': 'src/vendor.coffee'
            compile:
                files:
                    'dist/app.js': 'src/alcarin/**/*.coffee'
        less:
            compile:
                files: [
                    expand: true,
                    cwd: 'src/',
                    src: '**/*.less',
                    dest: 'dist/',
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
                    dest: 'dist/',
                    ext: '.html'
                ]
        shell:
            nodemon:
                # nodemon have problem with sending command line args to app when use coffeescript compiler,
                # its a reason for use grunt-shell instead of grunt-nodemon
                command: "nodemon --watch index.coffee -x 'coffee index.coffee --serve-src-files'"
            npmcss_index:
                command: "npm-css src/vendor.css > dist/vendor.css"
        concurrent:
            dev:
                tasks: ['shell:nodemon', 'watch'],
                options:
                    logConcurrentOutput: true
        browserify:
            build_index_js:
                expand: true
                flatten: false
                cwd: 'dist/'
                src: 'vendor.js'
                dest: 'dist/'
                ext: '.js'

    grunt.registerTask('build', ['clean', 'newer:coffee', 'newer:browserify:build_index_js',
                                 'newer:less', 'shell:npmcss_index', 'newer:htmlmin'])
    grunt.registerTask('run', ['build', 'concurrent'])
    grunt.registerTask('default', ['run'])
