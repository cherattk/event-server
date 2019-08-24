/**
 * @module EventMapMananger
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

import {DataEvent} from './event';

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
  },

  updateData : function(entity){
    var _entity = Object.assign({} , entity);
    var eventName = 'update-element-' + _entity.type;
    _eventMap.setEntity(_entity);
    DataEvent.dispatch(eventName , {id : _entity.id});
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
    return list;
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

}

export default EventMapManager;