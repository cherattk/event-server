/**
 * @copyright Copyright (c) 2019 cheratt karim
 * @license MIT Licence
 */

const fs = require('fs');

function Adminer(mapFilePath, Logger) {

  const _eventMapFile = mapFilePath;
  const _logger = Logger;

  // @see nano package docs at https://www.npmjs.com/package/nano#dbfindselector-callback
  // @see couchDB docs at https://docs.couchdb.org/en/2.3.1/api/database/find.html
  const __mangoQuery = {
    selector: {},
    limit: 30
  };

  var _entitySchema = { service: [], event: [], listener: [] };

  this.getEventMap = function(Request, Response) {
    /**
     * @todo check map's schema
     * dont use require() because it uses a cache
     */

    fs.readFile(_eventMapFile, { encoding: 'utf8' }, function(error, data) {
      if (error) {
        console.error(error);
        Response.json(_entitySchema);
      }
      else {
        try {
          var eventMap = JSON.parse(data);
          Response.json(eventMap);
        } catch (error) {
          console.error('======= catched error : Adminer.getEventMap() ========');
          console.error(error);
          Response.json(_entitySchema);
        }
      }
    });
  },

    /**
     * @todo validate query params
     */
    this.getActivity = function(Request, Response) {

      let activityType = Request.query.tag || '';
      if (!activityType) {
        Response.status(400).json({
          message: `bad request : you need to provide activity's tag value`
        });
        return;
      }
      let criteria = Object.assign({}, __mangoQuery);
      criteria.selector.log_type = {
        "$eq": activityType
      };

      Response.status(404).json(
        { activity: activityType , 
          data: []
        }
      );

      // _logger.fetch(criteria).then(function(data) {
      //   // todo : the [data] must be formated by a method implemented by the driver
      //   // ex :  couchDBDriver.format(result) : Array<data : Object>
      //   Response.json({ activity: activityType, data: data.docs });
      // }).catch(function(error) {
      //   _logger.generalError(error);
      //   Response.status(404).json({ activity: activityType, data: [] });
      // });

    }

  this.saveEventMap = function(Request, Response) {

    fs.writeFile(_eventMapFile, Request.body.event_map, 'utf8', function(error) {
      var _response = {
        message: 'event-map-saved'
      };
      if (error) {
        console.error(error);
        _response.message = 'error-saving-eventmap';
      }
      Response.json(_response);
    });
  }
}

module.exports = function(mapFilePath, Logger) {
  return new Adminer(mapFilePath, Logger);
}