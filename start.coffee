connect = require 'connect'

app = connect()
app.use connect.static './app'
server = app.listen 8080