const http = require('http');
const queryString = require('querystring');

const listener = [
  {hostname : 'localhost' , port : '3002'},
  {hostname : 'localhost' , port : '3003'},
  {hostname : 'localhost' , port : '3004'},
  {hostname : 'localhost' , port : '3005'}
];

listener.forEach(function(obj, idx){

  var index = idx + 1;
  http.createServer((Request, Response) => {

    if(Request.method === 'POST'){
      var body = '';
      Request.on('data', function(data){
        body += data;
      }).on('end', () => {
  
        console.log(`================= listener ${index} ==================\n`); 
        console.log('received message'); 
        console.log(body); 
        console.log(`======================================================\n`); 
        Response.end(`Hello From Listener (${index}) - Data : ${JSON.stringify(body)}`);
      });
    }
  
    Response.statusCode = 200;
    Response.setHeader("Access-Control-Allow-Origin", "*");
    Response.setHeader('Content-Type', 'text/plain');
    Response.end('end');
  })
  .listen(obj.port, obj.hostname, () => {
    console.log(`listener (${index}) running at http://${obj.hostname}:${obj.port}/`);
  });
});
