define ->
  class User extends dermis.Model
    constructor: ->
      super
      @setStatic()

    url: -> "/v1/users/#{@get('handle')}"
    setStatic: ->
      @set 'profileImage', @profileImage()
      @set 'profileImageLarge', @profileImageLarge()
      @set 'profileUrl', "/user/#{@get('handle')}"
      return @
      
    fetch: ->
      request.get @url(), (err, res) =>
        return console.log err if err?
        @set res.body
        @setStatic()

    profileImage: ->
      "http://api.twitter.com/1/users/profile_image?screen_name=#{@get('handle')}&size=normal"

    profileImageLarge: ->
      "http://api.twitter.com/1/users/profile_image?screen_name=#{@get('handle')}&size=bigger"

  return User