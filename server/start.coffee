express = require 'express'
http = require 'http'
Vein = require 'vein'
{join} = require 'path'

config = require './config'
pubdir = join __dirname, '../public'

app = express()
app.use express.static pubdir

server = http.createServer(app).listen config.port

# RPC
rpc = Vein.createServer server

rpc.addFolder join __dirname, './services'

# page.js crap
app.get '/*', (req, res) ->
  res.sendfile join pubdir, "index.html"

console.log "Server running on #{config.port}"