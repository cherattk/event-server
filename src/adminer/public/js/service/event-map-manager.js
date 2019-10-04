/**
 * @module EventMapMananger
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

import {DataEvent} from './ui-event';
import HttpClient from 'request';

var _eventMap = null;

const EventMapManager = {

  setEventMap: function (EventMap) {
    if (!_eventMap) {
      _eventMap = EventMap;
    }
  },

  ////////////////////////////////////////////////////////////
  addData : function(entity){
    var eventName = 'update-list-' + entity.type;
    _eventMap.setEntity(entity);

    var message = {};
    if(entity.type === 'event'){
      message.service_id = entity.service_id;
    }
    else if(entity.type === 'listener'){
      message.event_id = entity.event_id;
    }

    DataEvent.dispatch(eventName , message);
    this.saveEventMap();

  },

  updateData : function(entity){
    var _entity = Object.assign({} , entity);
    var eventName = 'update-element-' + _entity.type;
    _eventMap.setEntity(_entity);

    DataEvent.dispatch(eventName , {id : _entity.id});
    this.saveEventMap();

  },

  ///////////////////////////////////////////////////////////
  deleteData : function (entity) {
    const list = _eventMap.removeById(entity.type , entity.id);
    let eventName = 'update-list-' + entity.type;
    let message = {};
    if(entity.type === 'event'){
      message.service_id = entity.service_id;
    }
    else if(entity.type === 'listener'){
      message.event_id = entity.event_id;
    }

    DataEvent.dispatch(eventName , message);
    
    this.saveEventMap();
  },

  ////////////////////////////////////////////////////////////
  getData: function(type , id) {
    return _eventMap.getById(type , id);
  },

  ///////////////////////////////////////////////////////////
  getDataList: function (type , criteria) {
    const list = _eventMap.getList(type , criteria);
    return list;
  },

  saveEventMap : function(){

    var mapStore = {
      service : _eventMap.getList('service'),
      event : _eventMap.getList('event'),
      listener : _eventMap.getList('listener'),
    }    
    
    HttpClient.post({
      json : true,
      url : 'http://localhost:4000/event-map',
      form : {event_map : JSON.stringify(mapStore)}
    } , function cb(err,httpResponse,body){
      if(err){
        return console.log(err);
      }
      console.log(body);
    });
    
  }

}

export default EventMapManager;