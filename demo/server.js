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
    description: 'Convert the string to binary notation',
    format: 2
  },
  {
    hostname: 'localhost', port: '3002',
    description: 'Convert the string to octal notation',
    format: 8
  },
  {
    hostname: 'localhost', port: '3003',
    description: 'Convert the string to hexadecimal notation',
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
  server.get('/' , function(Request , Response){

    var warning = serverIndex == 1 ? `<br/>
                    <span style="display:block;background-color:#dc3545;color:white;padding : 10px;">
                    and it look that i have a bug in my code</span>`
                      : '' ;
    var msg = `<h1 style="text-align:center">
                Hi Dear User, i\'m a microservice #${serverIndex},
                <br/>
                my job is to 
                <span style="color:#1483dc;"> ${listener[idx].description}</span>
                ${warning}
                <h1>`;
    Response.format({
      'text/html': function () {
        Response.send(msg);
      },
    });
  });

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

});
