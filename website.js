// when api was introduced this file wasmovid into index.js

/*var express = require('express');
var app = express();

function keepAlive(){
  app.listen(3000, ()=>{console.log("Server is Ready!")});
}

module.exports = keepAlive;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/guilds', function(req, res) {
  res.send(client.guilds.size);
});

app.listen();*/

/*fs.readFile('./index.html', function (err, html) {
  if (err) {
    throw err; 
  }
  console.log("Web server ready")
  http.createServer(function(request, response) {
    if(request.url == '/api*') {
      response.writeHeader(200, {"Content-Type": "text/html"});
      response.write(request.url);
      response.end();
    }
    else {
      response.writeHeader(200, {"Content-Type": "text/html"});
      response.write(html);
      response.end();
    }
  }).listen();
});*/