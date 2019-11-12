const http = require('http');
const path = require('path');
const express = require('express');
const ServerStatic = express();
// const cors = require('cors');
// ServerStatic.use(cors());

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

/**********************************************************
 * Publisher APP
 ***********************************************************/
const Publisher = { port: 4000, hostname: 'localhost' };
ServerStatic.use('/', express.static(path.join(__dirname, './')));
ServerStatic.listen(Publisher.port, Publisher.hostname, function () {
  console.log(`Publisher running at http://${Publisher.hostname}:${Publisher.port}`);
});

/**********************************************************
 * Data Server
 ***********************************************************/
const dataServer = { port: 3000, hostname: 'localhost' };
http.createServer((Request, Response) => {
  Response.statusCode = 200;
  Response.setHeader("Access-Control-Allow-Origin", "*");
  Response.setHeader('Content-Type', 'application/json');
  Response.end(JSON.stringify(ListenerDataStore));

}).listen(dataServer.port, dataServer.hostname, () => {
  console.log(`data server running at http://${dataServer.hostname}:${dataServer.port}`);
});

/**********************************************************
 * Listeners Server
 ***********************************************************/
var process = function (event, format) {
  var result = '';
  var str = event.event_message;
  for (var i = 0; i < str.length; i++) {
    // result += Number(str.charCodeAt(i)).toString(format);
    result += str.charCodeAt(i).toString(format);
  }
  return result;
};

listener.forEach(function (obj, idx) {

  var serverIndex = idx + 1;
  var listenerEndpoint = `http://${obj.hostname}:${obj.port}`;

  
  
  var server = express();
  server.use(express.urlencoded({ extended: true }));
  server.post('/push_event', function (Request , Response) {

    var dispatchBody = Request.body.event;
    console.log(`================= listener ${serverIndex} ==================\n`);
    console.log('received message');
    console.log(dispatchBody);
    console.log(`======================================================\n`);

    ListenerDataStore[idx] = {
      listener: listenerEndpoint,
      description: listener[idx].description,
      event_name: dispatchBody.event_name,
      event_message: dispatchBody.event_message,
      processed_data: process(dispatchBody, obj.format)
    }

    Response.status(200).end();

  }).listen(obj.port, obj.hostname, () => {
    console.log(`listener (${serverIndex}) running at ${listenerEndpoint}`);
  });

  /*
  http.createServer((Request, Response) => {

    Response.statusCode = 404;
    Response.setHeader("Access-Control-Allow-Origin", "*");
    Response.setHeader('Content-Type', 'text/plain');

    var path = Request.url;
    if (path === '/push_event' && Request.method === 'POST') {
      let body = [];
      Request.on('data', function (chunk) {
        body.push(chunk);
      }).on('end', () => {

        body = Buffer.concat(body).toString();
        console.log(`================= listener ${serverIndex} ==================\n`);
        console.log('received message');
        console.log(body);
        console.log(`======================================================\n`);

        Response.statusCode = 200;
        ListenerDataStore[idx] = {
          listener: listenerEndpoint,
          description: listener[idx].description,
          event_data: body,
          processed_data: process(body , obj.format)
        }
      });
    }
    Response.end();
  })
    .listen(obj.port, obj.hostname, () => {
      console.log(`listener (${serverIndex}) running at ${listenerEndpoint}`);
    });

  */

});
