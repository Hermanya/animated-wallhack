module.exports = (grunt) ->
  grunt.initConfig(
    pkg: grunt.file.readJSON('package.json'),
    watch:
      options:
        livereload: true
      css:
        files: '**/*.styl'
        tasks: ['stylus','autoprefixer']
      coffee:
        files: '**/*coffee'
        tasks: ['coffeelint','coffeeify']
    stylus:
      compile:
        files:
          'app/style.css': ['_app/stylesheets/*.styl']
    coffeelint:
      app: ['*.coffee']
      options:
        configFile: 'coffeelint.json'
    coffeeify:
      options:
        debug: true
      files:
        src: '_app/*.coffee'
        dest: 'app/script.js'
    connect:
      server:
        options:
          livereload: 35729
          open: true
          hostname: 'localhost'
    autoprefixer:
      sourcemap:
        options:
          map: true
        src: 'app/*.css'
  )
  grunt.loadNpmTasks('grunt-contrib-stylus')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-coffeelint')
  grunt.loadNpmTasks('grunt-coffeeify')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-autoprefixer')
  grunt.registerTask('default',
  ['coffeelint','coffeeify','stylus','autoprefixer','connect','watch'])
