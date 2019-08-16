/**
 * DEMO DATA
 */


const dbName = 'event_db';
const nanoDriver = require('nano')({
  url: `http://localhost:5984/${dbName}`
});

const Logging = require('../../src/core/Logging');
const dataMapFile = require('../../config/data-event-map.json');

var txt = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Aenean sem magna, fermentum vitae viverra quis, commodo eu libero.
 Sed posuere massa eros, eget ultrices lacus ornare ac. Nulla sed 
 purus eu velit fermentum tempus. Sed mattis augue 
non orci pharetra efficitur. Suspendisse gravida felis ac erat efficitur`;
dataMapFile.event.map(function(event){
  event.description = txt;
  event.message = {
    item_id : 12,
    qte : 2
  };
  Logging(nanoDriver).event(event).catch((error) => console.error(error));
});



// Dispatching error ////////////////////////////////////////////////////////
var errorDispatching = {
  event_id : 'e-1',
  listener_id: 'l-1',
  // this is the httpclient.post() catched error
  error : {
    status_code: 400,
    error_message: 'error from listener-1'
  }
};
Logging(nanoDriver).errorDispatching(errorDispatching).catch((error) => console.error(error));
Logging(nanoDriver).errorDispatching(errorDispatching).catch((error) => console.error(error));

// Bad Query Error ///////////////////////////////////////////////////////////////////////
// the 'event_id' field is missed in the query
var badQuery = {
  field : 'not-required-param-value',
  message: {
    field_1 : 'value-1',
    field_2 : 'value-2'
  }
};
Logging(nanoDriver).errorBadQuery(badQuery).catch((error) => console.error(error));
Logging(nanoDriver).errorBadQuery(badQuery).catch((error) => console.error(error));
