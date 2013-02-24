express = require 'express'
http = require 'http'
{join} = require 'path'
request = require 'request'

db = require './database'
config = require './config'
pubdir = join __dirname, '../public'

app = express()
#app.use express.logger()
app.use express.compress()
app.use express.methodOverride()
app.use express.bodyParser()
app.use express.cookieParser()
app.use express.static pubdir

app.use '/v1', require './resources/authMiddleware'

app.get '/v1/users/me', require './resources/users/me'
app.get '/v1/users', require './resources/users/getAll'
app.get '/v1/users/:handle', require './resources/users/get'
app.put '/v1/users/:handle', require './resources/users/update'
app.del '/v1/users/:handle', require './resources/users/delete'

# page.js crap
app.get '/*', (req, res) ->
  res.sendfile join pubdir, "index.html"

server = http.createServer(app).listen config.port
console.log "Server running on #{config.port}"