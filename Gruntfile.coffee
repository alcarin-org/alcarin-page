"use strict"

module.exports = (grunt)->
    modules = ['grunt-contrib-watch', 'grunt-newer', 'grunt-contrib-coffee', 'grunt-contrib-less',
               'grunt-contrib-htmlmin', 'grunt-shell', 'grunt-concurrent', 'grunt-browserify']
    DIST_DIR = 'dist/'

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
                files: "#{DIST_DIR}/**/*.css"
            browserify_index:
                files: 'src/index.coffee'
                tasks: ['newer:browserify:build_index_js']
        coffee:
            options:
                sourceMap: true
                bare: true
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
                    dest: DIST_DIR,
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
                    dest: DIST_DIR,
                    ext: '.html'
                ]
        shell:
            nodemon:
                # nodemon have problem with sending command line args to app when use coffeescript compiler,
                # its a reason for use grunt-shell instead of grunt-nodemon
                command: "nodemon -x 'coffee index.coffee --serve-src-files'"
            npmcss_index:
                command: "npm-css src/vendor.css > #{DIST_DIR}/vendor.css"
        concurrent:
            dev:
                tasks: ['shell:nodemon', 'watch'],
                options:
                    logConcurrentOutput: true
        browserify:
            build_index_js:
                expand: true
                flatten: false
                cwd: DIST_DIR
                src: 'vendor.js'
                dest: DIST_DIR
                ext: '.js'

    grunt.registerTask('build', ['newer:coffee', 'newer:browserify:build_index_js',
                                 'newer:less', 'shell:npmcss_index', 'newer:htmlmin'])
    grunt.registerTask('run', ['build', 'concurrent'])
    grunt.registerTask('default', ['run'])
