/**
 * @copyright Copyright (c) 2019 cheratt karim
 * @license MIT Licence
 */


const fs = require('fs');
const path = require('path');
const EventMapFile = path.resolve('./src/config/eventmap.json');
const EventMap = require('./eventmap');
const EventLog = require('../../lib/event-log')(function () {
  return require('../../lib/driver/couchdb')("http://localhost:5984/event_db");
});

module.exports = function () {

  return new (function Adminer() {

    // @see nano package docs at https://www.npmjs.com/package/nano#dbfindselector-callback
    // @see couchDB docs at https://docs.couchdb.org/en/2.3.1/api/database/find.html
    const __mangoQuery = {
      selector: {},
      limit: 30
    };

    /**
     * dont use require() because it uses a cache
     */

    var __EventMap = new EventMap();
    __EventMap.initFromFile(EventMapFile);

    this.getEventMap = function (Request, Response) {
      Response.json(__EventMap.toJSON());
    }

    /**
     * @todo validate query params
     */
    this.getActivity = function (Request, Response) {

      let activityType = Request.query.tag || '';
      if (!activityType) {
        Response.status(400).json({
          message: `bad request : you need to provide activity's tag value`
        });
        return;
      }

      let __criteria = Object.assign({}, __mangoQuery);
      __criteria.selector.log_type = {
        "$eq": activityType
      };

      EventLog.Fetch(__criteria).then(function (data) {
        // todo : the [data] must be formated by a method implemented by the driver
        // ex :  couchDBDriver.format(result) : Array<data : Object>
        Response.json({ activity: activityType, data: data.docs });
      }).catch(function (error) {
        //EventLog.Insert(generalError(error));
        console.log(error);
        Response.status(404).json({ activity: activityType, data: [] });
      });

    }

    this.EntityActionResponse = function (Response, error) {
      if (error) {
        console.error(error);
        Response.status(500).json({
          message: 'action not completed'
        });
      }
      else {
        Response.status(200).json({
          eventmap: __EventMap.toJSON()
        });
      }
    }

    this.setEntity = function (Request, Response) {
      if (Request.body) {
        var __entityData = Request.body;
        __EventMap.setEntity(__entityData);

        var self = this;
        this.saveEventMapToFile(function (error) {
          self.EntityActionResponse(Response, error);
        });
      }
      else {
        Response.status(400).json({
          message: 'Bad Query Params'
        });
      }
    }

    this.removeEntity = function (Request, Response) {
      if (Request.body) {
        var entityType = Request.body.entity_type;
        var entityID = Request.body.entity_id;
        __EventMap.removeById(entityType, entityID);
        var self = this;
        this.saveEventMapToFile(function (error) {
          self.EntityActionResponse(Response, error);
        });
      }
      else {
        Response.status(400).json({
          message: 'error-saving-eventmap'
        });
      }
    }

    this.saveEventMapToFile = function (callback) {
      var __SerializedEventMap = JSON.stringify(__EventMap.toJSON());
      fs.writeFile(EventMapFile, __SerializedEventMap, 'utf8', function (error) {
        callback(error);
      });
    }
  });
}
