const http = require('http');

var DataStore = [];

const listener = [
  {hostname : 'localhost' , port : '3001'},
  {hostname : 'localhost' , port : '3002'},
  {hostname : 'localhost' , port : '3003'},
  {hostname : 'localhost' , port : '3004'},
  {hostname : 'localhost' , port : '3005'}
];

listener.forEach(function(obj, idx){

  var serverIndex = idx + 1;
  http.createServer((Request, Response) => {

    Response.setHeader("Access-Control-Allow-Origin", "*");
    Response.setHeader('Content-Type', 'text/plain');

    if(Request.method === 'POST'){
      var body = '';
      Request.on('data', function(data){
        body += data;
      }).on('end', () => {  
        console.log(`================= listener ${serverIndex} ==================\n`); 
        console.log('received message'); 
        console.log(body); 
        console.log(`======================================================\n`); 
        Response.statusCode = 200;
      });
    }
    else{
      Response.statusCode = 404;
    }

    Response.end(JSON.stringify(body));
    
  })
  .listen(obj.port, obj.hostname, () => {    
    console.log(`listener (${serverIndex}) running at http://${obj.hostname}:${obj.port}/`);
  });

});
