var http = require('http');
var fs = require("fs");

function keepAlive(){
  http.listen(3000, ()=>{console.log("Server is Ready!")});
}

fs.readFile('./index.html', function (err, html) {
  if (err) {
    throw err; 
  }
  console.log("Web server ready")
  http.createServer(function(request, response) {  
    response.writeHeader(200, {"Content-Type": "text/html"});
    response.write(html);
    response.end();
  }).listen();
});