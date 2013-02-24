db = require 'mongoose'
async = require 'async'
requireDir = require 'require-dir'
{join} = require 'path'
config = require './config'

db.connect config.database

models = requireDir join __dirname, "./models/"
db.model k, v for k,v of models

db.wipe = (cb) ->
  async.parallel (m.remove.bind m for _, m of db.models), cb
  return db

module.exports = db