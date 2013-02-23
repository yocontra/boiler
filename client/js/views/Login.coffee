define ["templates/login"], (templ) ->
  class Login extends dermis.View
    className: "login-view"
    template: templ
    events:
      "click .twitterLogin": "loginTwitter"
      "click .facebookLogin": "loginFacebook"

    loginTwitter: ->
      singly.authorize 'twitter'

    loginFacebook: ->
      singly.authorize 'facebook'

    render: ->
      @$el.html @template()
      dermis.channel.emit "login.rendered"
      return @

  return Login