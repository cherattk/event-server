/**
 * @module EventMapMananger
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

const DataEvent = require('./ui-event').DataEvent;
const HttpClient = require('axios');
const config = require('../config/adminer.config');
const QueryString = require('querystring');

const EventMap = require('../../../server/eventmap');
const __EventMap = new EventMap();

const EventMapManager = {

  loadEventMap: function (callback) {
    HttpClient({
      method: "GET",
      responseType: "json",
      url: config.eventmap_url
    }).then(function (response) {      
      __EventMap.buildMap(response.data);
      callback();
    }).catch(function (error) {
      console.log(error);
    });
  },

  ////////////////////////////////////////////////////////////
  addData: function addData(entity) {

    // set entity localy
    // __EventMap.setEntity(entity);

    // message to notify listeners
    var message = {};
    if (entity.type === 'event') {
      message.service_id = entity.service_id;
    }
    else if (entity.type === 'listener') {
      message.event_id = entity.event_id;
    }

    var eventName = 'update-list-' + entity.type;
    this.saveEntityChange(entity, 'set', function () {
      DataEvent.dispatch(eventName, message);
    });

  },

  updateData: function updateData(entity) {

    // __EventMap.setEntity(_entity);
    // notify listeners
    var _entity = Object.assign({}, entity);
    var eventName = 'update-element-' + _entity.type;

    this.saveEntityChange(entity, 'set', function () {
      DataEvent.dispatch(eventName, { id: _entity.id });
    });


  },

  ///////////////////////////////////////////////////////////
  deleteData: function deleteData(entity) {
    // __EventMap.removeById(entity.type, entity.id);

    // notify listeners
    let eventName = 'update-list-' + entity.type;
    let message = {};
    if (entity.type === 'listener') {
      message.event_id = entity.event_id;
    }

    this.saveEntityChange(entity, 'remove', function () {
      DataEvent.dispatch(eventName, message);
    });
  },

  ////////////////////////////////////////////////////////////
  getData: function (type, id) {
    return __EventMap.getById(type, id);
  },

  ///////////////////////////////////////////////////////////
  getDataList: function (type, criteria) {
    const list = __EventMap.getList(type, criteria);
    return list;
  },

  /**
   * EventMap Client
   */
  saveEntityChange: function (entity, action, callback) {

    var __method = "POST";
    var __requestParam = "";
    if (action === "remove") {
      __method = "DELETE";
      __requestParam = QueryString.stringify({
        entity_id: entity.id,
        entity_type: entity.type
      });
    }
    else if (action === "set") {
      __method = "POST";
      __requestParam = QueryString.stringify(entity);
    }
    else {
      throw new Error('bad action');
    }

    HttpClient({
      method: __method,
      responseType: "json",
      url: config.entity_url,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: __requestParam
    }).then(function (response) {
        // 1 - Firstly update local EventMap
        // the callback may need of updated eventmap
        __EventMap.buildMap(response.data.eventmap);

        // 2 - run callback
        callback(response);

      }).catch(function (error) {
        console.error(error);
      });
  }

}

module.exports = EventMapManager;