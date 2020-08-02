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
    description: 'Convert string to binary notation',
    format: 2
  },
  {
    hostname: 'localhost', port: '3002',
    description: 'Convert string to octal notation',
    format: 8
  },
  {
    hostname: 'localhost', port: '3003',
    description: 'Convert string to hexadecimal notation',
    format: 16
  }
];

/**********************************************************
 * Publisher APP
 ***********************************************************/
const Publisher = { port: 4000, hostname: 'localhost' };
ServerStatic.use('/', express.static(path.join(__dirname, './')));
ServerStatic.listen(Publisher.port, Publisher.hostname, function () {
  console.log(`Publisher Application running at http://${Publisher.hostname}:${Publisher.port}`);
});

/**********************************************************
 * Data Server
 * Send The content of the LIstenerDataStore Array
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
 * The Listeners Server store processed message and 
 * store results in LIstenerDataStore Array
 ***********************************************************/
processData = function (event, format) {
  var result = '';
  var _value = '';

  var str = event.event_message;
  for (var i = 0; i < str.length; i++) {
    _value = str.charCodeAt(i).toString(format);
    if(format === 2 && _value.length < 8){
      result += '<b>' + new Array(9 - _value.length).join('0') + _value + '&nbsp;&nbsp;&nbsp;</b>';
    }
    else{
      result += '<b>' + _value + '&nbsp;&nbsp;&nbsp;</b>';
    }
    
  }
  return result;
}

listener.forEach(function (_listener, idx) {

  var serverIndex = idx + 1;
  var listenerEndpoint = `http://${_listener.hostname}:${_listener.port}`;

  var server = express();
  const bodyParser = require('body-parser');
  server.use(bodyParser.urlencoded({ extended: true }));
  server.get('/', function (Request, Response) {
    var msg = `<h1 style="text-align:center">
                Hi Dear User, i\'m a microservice #${serverIndex},
                <br/>
                my job is to 
                <span style="color:#1483dc;"> ${listener[idx].description}</span>
                <h1>`;
    Response.format({
      'text/html': function () {
        Response.send(msg);
      },
    });
  });


  /**
   * Listener Endpoint
   */
  server.post('/', function (Request, Response) {

    var receivedEvent = Request.body;
    console.log(`================= listener ${serverIndex} ==================\n`);
    console.log('received message');
    console.log(receivedEvent);
    console.log(`======================================================\n`);

    ListenerDataStore[idx] = {
      listener: listenerEndpoint,
      description: listener[idx].description,
      event_name: receivedEvent.event_name,
      event_message: receivedEvent.event_message,
      // processed_data: process(receivedEvent, _listener.format)
      processed_data: processData(receivedEvent, _listener.format)
    }

    Response.status(200).end();

  }).listen(_listener.port, _listener.hostname, () => {
    console.log(`listener (${serverIndex}) running at ${listenerEndpoint}`);
  });

});
