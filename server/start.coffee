express = require 'express'
http = require 'http'
Vein = require 'vein'
{join} = require 'path'

config = require './config'

app = express()
app.use express.static  join __dirname, '../public'

server = http.createServer(app).listen config.port

# RPC
rpc = Vein.createServer server: server

rpc.addFolder join __dirname, './services'

console.log "Server running on #{config.port}"