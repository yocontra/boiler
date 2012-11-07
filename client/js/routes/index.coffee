define ["app/server", "templates/index"], (server, indexTempl) ->
  init: -> @emit 'ready'
  
  show: ->
    server.ready ->
      server.example (msg) ->
        $("#main").html indexTempl message: msg
  hide: ->