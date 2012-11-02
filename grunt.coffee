path = {join} = require 'path'
coffee = require 'coffee-script'

app =
  paths:
    client: "./client"
    server: "./server"
    public: "./public"

gruntConfig =
  pkg: "<json:package.json>"

  jaded:
    app:
      src: [ "#{app.paths.client}/templates/*.jade" ]
      dest:  "#{app.paths.public}/templates"
      options:
        amd: true
        development: false
        rivets: false

  coffee:
    app:
      src: [ "#{app.paths.client}/js/*.coffee" ]
      dest:  "#{app.paths.public}/js"
      options:
        bare: true

    routes:
      src: [ "#{app.paths.client}/js/routes/*.coffee" ]
      dest:  "#{app.paths.public}/js/routes"
      options:
        bare: true

    vendor:
      src: [ "#{app.paths.client}/js/vendor/*.coffee" ]
      dest:  "#{app.paths.public}/js/vendor"
      options:
        bare: true

  reload: {}

  lint:
    files: [ "grunt.js", "lib/**/*.js" ]

  copy:
    dist: 
      files:
        "./public/js/vendor/": "#{app.paths.client}/js/vendor/**"
        "./public/css/": "#{app.paths.client}/css/**"
        "./public/img/": "#{app.paths.client}/img/**"
        "./public/": "#{app.paths.client}/index.html"

  ##
  ## watch
  ##

  watch:
    client: 
      files: [
        "#{app.paths.client}/js/vendor/**",
        "#{app.paths.client}/css/**",
        "#{app.paths.client}/index.html"
      ]
      tasks: "copy reload"

    templates:
      files: ["<config:jaded.app.src>"]
      tasks: "jaded reload"  

    coffee:
      files: [
       "<config:coffee.app.src>",
       "<config:coffee.routes.src>",
       "<config:coffee.vendor.src>"
      ]
      tasks: "coffee reload"

  globals:
    exports: true

module.exports = (grunt) ->
  ## init config 
  grunt.initConfig gruntConfig

  grunt.loadNpmTasks "grunt-contrib"
  grunt.loadNpmTasks "grunt-coffee"   
  grunt.loadNpmTasks "grunt-reload"
  grunt.loadNpmTasks "grunt-exec"
  grunt.loadNpmTasks "grunt-jaded"

  ## default 
  grunt.registerTask "default", "start copy jaded lint coffee reload watch"

  ## start
  grunt.registerTask "start", "start up servers", ->
    grunt.log.writeln "starting..."
    server = require "#{app.paths.server}/start"