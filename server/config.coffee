module.exports =
  port: process.env.PORT or 8080
  database: process.env.DATABASE or "mongodb://localhost/boiler"