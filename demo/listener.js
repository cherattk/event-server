const http = require('http');

var ListenerDataStore = [];

const listener = [
  {
    hostname: 'localhost', port: '3001',
    description: 'Convert message to binary notation',
    format: 2
  },
  {
    hostname: 'localhost', port: '3002',
    description: 'Convert message to octal notation',
    format: 8
  },
  {
    hostname: 'localhost', port: '3003',
    description: 'Convert message to hexadecimal notation',
    format: 16
  }
];


/**
 * 
 */

const dataServer = { port: 3000, hostname: 'localhost' };
http.createServer((Request, Response) => {

  Response.statusCode = 200;
  Response.setHeader("Access-Control-Allow-Origin", "*");
  Response.setHeader('Content-Type', 'text/plain');
  Response.end(JSON.stringify(ListenerDataStore));

}).listen(dataServer.port, dataServer.hostname, () => {
  console.log(`data server running at http://${dataServer.hostname}:${dataServer.port}`);
})

/**
 * 
 */
listener.forEach(function (obj, idx) {

  var serverIndex = idx + 1;
  var listenerEndpoint = `http://${obj.hostname}:${obj.port}/`;

  http.createServer((Request, Response) => {

    Response.statusCode = 404;
    Response.setHeader("Access-Control-Allow-Origin", "*");
    Response.setHeader('Content-Type', 'text/plain');

    var path = Request.url;
    if (path === '/push_event' && Request.method === 'POST') {
      var body = '';
      Request.on('data', function (data) {
        body += data.toString();
      }).on('end', () => {
        console.log(`================= listener ${serverIndex} ==================\n`);
        console.log('received message');
        console.log(body);
        console.log(`======================================================\n`);

        Response.statusCode = 200;
        ListenerDataStore[idx] = {
          listener: listenerEndpoint,
          description : listener[idx].description,
          event_data: body,
          processed_data: (function (str) {
            var result = '';
            for (var i = 0; i < str.length; i++) {
              result += Number(str.charCodeAt(i)).toString(obj.format);
            }
            return result;
          })(body)
        }
      });
    }
    Response.end();
  })
    .listen(obj.port, obj.hostname, () => {
      console.log(`listener (${serverIndex}) running at ${listenerEndpoint}`);
    });

});
