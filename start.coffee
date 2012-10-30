connect = require 'connect'

###
telnet 192.168.1.1
iwconfig ath0 mode managed key s:bec3$2Psn* essid BN-INTERNET; ifconfig ath0 192.168.1.1 netmask 255.255.255.0 up; route add default gw 192.168.1.1
###

app = connect()
app.use connect.static './app'
server = app.listen 8080