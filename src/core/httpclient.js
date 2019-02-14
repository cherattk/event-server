const request = require('request');

function HttpClient() {

  /**
   * 
   * @param {Object} event 
   * @param {string} listener listener url
   */
  this.callListener = function (Event, listener) {
    var _event = Event;
    // console.log(`listener url : ${listener}`);
    // console.log(`post to : ${ev.topic} ,  event : ${ev.event} with message : ${ev.message}`);

    request.post({
      url: listener,
      form: _event
    },
      function (error, httpResponse, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', httpResponse && httpResponse.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
      });
  }
}

module.exports = HttpClient();