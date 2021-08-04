/**
 * @module EventMapMananger
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

const DataEvent = require('./ui-event').DataEvent;
const HttpClient =  require('axios');
const config = require('../config/adminer.config');
const EventMap =  require('./eventmap');

var _eventMap = undefined;

const EventMapManager = {

  init : function init(entities){
    if(!_eventMap){
      _eventMap = new EventMap(entities);
    }

  },

  ////////////////////////////////////////////////////////////
  addData : function addData (entity) {
    _eventMap.setEntity(entity);

    // notify listeners
    var message = {};
    if (entity.type === 'event') {
      message.service_id = entity.service_id;
    }
    else if (entity.type === 'listener') {
      message.event_id = entity.event_id;
    }

    var eventName = 'update-list-' + entity.type;
    DataEvent.dispatch(eventName, message);
    this.saveEventMap();

  },

  updateData : function updateData(entity) {

    _eventMap.setEntity(_entity);

    // notify listeners
    var _entity = Object.assign({}, entity);
    var eventName = 'update-element-' + _entity.type;

    DataEvent.dispatch(eventName, { id: _entity.id });
    this.saveEventMap();

  },

  ///////////////////////////////////////////////////////////
  deleteData : function deleteData(entity) {
    _eventMap.removeById(entity.type, entity.id);

    // notify listeners
    let eventName = 'update-list-' + entity.type;
    let message = {};
    if (entity.type === 'listener') {
      message.event_id = entity.event_id;
    }
    DataEvent.dispatch(eventName, message);
    this.saveEventMap();
  },

  ////////////////////////////////////////////////////////////
  getData : function getData(type, id) {
    return _eventMap.getById(type, id);
  },

  ///////////////////////////////////////////////////////////
  getDataList : function getDataList(type, criteria) {
    const list = _eventMap.getList(type, criteria);
    return list;
  },

  saveEventMap : function saveEventMap() {

    var mapStore = {
      service: _eventMap.getList('service'),
      event: _eventMap.getList('event'),
      listener: _eventMap.getList('listener'),
    }

    // HttpClient({
    //   method : "POST",
    //   responseType: "json",
    //   url: config.eventmap_url,
    //   data : {
    //     event_map: JSON.stringify(mapStore)
    //   }
    // })
    HttpClient.post(config.eventmap_url,
      {
        event_map : JSON.stringify(mapStore)
      }
    )
    .then(function (err) {
      if (err) {
        return console.log(err);
      }
    });
  }

}

module.exports = EventMapManager;