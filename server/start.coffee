connect = require 'connect'
Vein = require 'vein'
{join} = require 'path'

config = require './config'

app = connect()
app.use connect.static  join __dirname, '../public'
server = app.listen config.port

# RPC
rpc = Vein.createServer server: server

rpc.addFolder join __dirname, './services'

console.log "Server running on #{config.port}"