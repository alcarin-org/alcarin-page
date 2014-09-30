"use strict"

module.exports = (grunt)->
    modules = ['grunt-contrib-watch', 'grunt-newer', 'grunt-contrib-coffee', 'grunt-contrib-less',
               'grunt-contrib-htmlmin', 'grunt-shell', 'grunt-concurrent', 'grunt-contrib-clean',
               'grunt-wiredep']

    grunt.loadNpmTasks(module) for module in modules

    grunt.initConfig
        pkg: grunt.file.readJSON('package.json')
        clean:
            all: ['dist']
        watch: require './grunt-tasks/watch'
        coffee:
            options:
                sourceMap: true
                join: true
            compile:
                files:
                    'dist/alcarin.js': ['src/app.coffee', 'src/components/**/*.coffee', 'src/alcarin/**/*.coffee']
        less:
            compile:
                options:
                    compress: true
                    sourceMap: true
                    paths: ['src/components', '.']
                files:
                    'dist/alcarin.css': 'src/alcarin/**/*.less'
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
                command: "nodemon --watch index.coffee -x 'coffee index.coffee --inject-livereload --serve-src-files'"
        concurrent:
            dev:
                tasks: ['shell:nodemon', 'watch'],
                options:
                    logConcurrentOutput: true
        wiredep:
            target:
                src: ['src/**/*.html']
                options:
                    ignorePath: '..',

    grunt.registerTask('build', ['clean', 'wiredep', 'newer:coffee', 'newer:less', 'newer:htmlmin'])
    grunt.registerTask('serve', ['build', 'concurrent'])
    grunt.registerTask('default', ['serve'])
