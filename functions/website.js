var express = require('express');
var app = express();

function keepAlive(){
  app.listen(3000, ()=>{console.log("Server is Ready!")});
}

module.exports = keepAlive;