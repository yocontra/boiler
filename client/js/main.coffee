define ["app/server","app/router","layouts/App"], (server, router, appLayout) ->
  
  $('body').html appLayout.render().el
  
  router.start()
  server.ready (services) ->
    console.log "Server connected:", services...