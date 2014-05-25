module.exports = (grunt) ->
  grunt.initConfig(
    pkg: grunt.file.readJSON('package.json'),
    watch:
      css:
        files: '**/*.styl'
        tasks: ['stylus']
        options:
          livereload: true
      js:
        files: '**/*.coffee'
        tasks: ['coffeelint','coffee','requirejs']
        options:
          livereload:true
    stylus:
      compile:
        files:
          'app/style.css': ['_app/stylesheets/*.styl']
    coffee:
      glob_to_multiple:
        expand: true
        flatten: true
        options:
          sourceMap: true
        cwd: '_app/'
        src: ['*.coffee']
        dest: 'app/JavaScripts/'
        ext: '.js'
    coffeelint:
      app: ['*.coffee']
    requirejs:
      compile:
        options:
          name: 'config',
          mainConfigFile: 'app/JavaScripts/config.js',
          out: 'app/JavaScripts/require.js',
          optimize: 'none'
  )
  grunt.loadNpmTasks('grunt-contrib-stylus')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-requirejs')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.registerTask('default',
  ['coffeelint','coffee','stylus','requirejs','watch'])
