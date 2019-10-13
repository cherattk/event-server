const http = require('http');

const hostname = 'localhost';
const port = 3100;
// const port = process.argv[2];

const server = http.createServer((Request, Response) => {

  let body = [];
  Request.on('data', function(chunk){
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log(body);
    // at this point, `body` has the entire Request body stored in it as a string
    Response.end(JSON.stringify({
      notification: body 
    }));

  });

  Response.statusCode = 200;
  Response.setHeader("Access-Control-Allow-Origin", "*");
  Response.setHeader('Content-Type', 'text/plain');
  // Response.end('Hello From Consumer!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});