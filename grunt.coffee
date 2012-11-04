gruntConfig =
  pkg: "<json:package.json>"

  rm:
    public: "./public/**"

  jaded:
    app:
      src: [ "./client/templates/*.jade" ]
      dest:  "./public/templates"
      options:
        amd: true
        development: false
        rivets: false

  coffee:
    app:
      src: [ "./client/js/*.coffee", "./client/js/*.js" ]
      dest:  "./public/js"
      options:
        bare: true

    routes:
      src: [ "./client/js/routes/*.coffee", "./client/js/routes/*.js" ]
      dest:  "./public/js/routes"
      options:
        bare: true

    vendor:
      src: [ "./client/js/vendor/*.coffee" ]
      dest:  "./public/js/vendor"
      options:
        bare: true

  reload: {}

  coffeelint:
    app: [
      "client/js/**/*.coffee",
      "client/js/*.coffee",
      "server/*.coffee",
      "server/**/*.coffee"
    ]

  lint:
    files: [ "public/js/routes/*.js", "public/js/*.js", "server/**/*.js" ]

  copy:
    dist:
      files:
        "./public/js/vendor/": "./client/js/vendor/**"
        "./public/css/": "./client/css/**"
        "./public/img/": "./client/img/**"
        "./public/index.html": "./client/index.html"

  ##
  ## watch
  ##

  watch:
    client: 
      files: [
        "./client/js/vendor/**",
        "./client/css/**",
        "./client/img/**",
        "./client/index.html"
      ]
      tasks: "copy reload"

    templates:
      files: ["<config:jaded.app.src>"]
      tasks: "jaded reload"  

    server:
      files: [
        "./server/*.coffee",
        "./server/**/*.coffee"
      ]
      tasks: "coffeelint"

    coffee:
      files: [
       "<config:coffee.app.src>",
       "<config:coffee.routes.src>",
       "<config:coffee.vendor.src>"
      ]
      tasks: "coffeelint coffee reload"

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
  grunt.loadNpmTasks "grunt-clean"
  grunt.loadNpmTasks "grunt-check-modules"
  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-rm"

  ## default 
  grunt.registerTask "default", "check-modules rm copy coffeelint coffee jaded reload start watch"

  ## start
  grunt.registerTask "start", "start up servers", ->
    grunt.log.writeln "Starting server..."
    server = require "./server/start"