define ->
  class User extends dermis.Model
    url: -> "/v1/users/#{@get('handle')}"

    profileImage: ->
      "http://api.twitter.com/1/users/profile_image?screen_name=#{@get('handle')}&size=normal"

    profileImageLarge: ->
      "http://api.twitter.com/1/users/profile_image?screen_name=#{@get('handle')}&size=bigger"

  return User