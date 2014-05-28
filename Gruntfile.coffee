module.exports = (grunt) ->
  grunt.initConfig(
    pkg: grunt.file.readJSON('package.json'),
    watch:
      options:
        livereload: true
      css:
        files: '**/*.styl'
        tasks: ['stylus']
      coffee:
        files: '**/*coffee'
        tasks: ['coffeeify']
    stylus:
      compile:
        files:
          'app/style.css': ['_app/stylesheets/*.styl']
    coffeelint:
      app: ['*.coffee']
    coffeeify:
      options:
        debug: true
      files:
        src:'_app/*.coffee'
        dest:'app/script.js'
    connect:
      server:
        keepalive: true
        livereload: 35729
  )
  grunt.loadNpmTasks('grunt-contrib-stylus')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-coffeeify')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.registerTask('default',
  ['coffeelint','coffeeify','stylus','connect','watch'])
