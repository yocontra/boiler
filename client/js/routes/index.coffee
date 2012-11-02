define ["templates/index"], (indexTempl) ->
  init: -> @emit 'ready'
  
  show: ->
    $("#main").html indexTempl()

  hide: ->