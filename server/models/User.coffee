{Schema} = require 'mongoose'

User = new Schema
  name:
    type: String
    required: true

  token:
    type: String
    required: true
    index:
      unique: true

  url: String
  handle:
    type: String
    required: true
    index:
      unique: true

  thumbnail_url: String
  description: String
  website: String
  location: String


module.exports = User