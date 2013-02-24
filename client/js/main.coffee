define ["app/router","layouts/App"], (router, appLayout) ->
  
  singly.setKey "dbc1540393c92f04d2907574b2a508e0"
  $('body').html appLayout.render().el
  
  router.start()