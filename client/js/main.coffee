define ["app/server"], (server) ->
  dermis.route '/'

  server.ready (services) ->
    console.log "Server connected:", services...