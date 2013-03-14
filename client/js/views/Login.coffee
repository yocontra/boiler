define ["templates/login"], (templ) ->
  class Login extends dermis.View
    className: "login-view"
    content: templ
    events:
      "click .twitterLogin": "loginTwitter"
      "click .facebookLogin": "loginFacebook"

    loginTwitter: ->
      singly.authorize 'twitter'

    loginFacebook: ->
      singly.authorize 'facebook'

  return Login