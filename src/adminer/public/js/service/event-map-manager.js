/**
 * @module EventMapMananger
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

import UIEvent from './ui-event';

var _eventMap = null;

const EventMapMananger = {

  setEventMap: function (EventMap) {
    if (!_eventMap) {
      _eventMap = EventMap;
    }
  },

  ////////////////////////////////////////////////////////////
  setData : function(entity){
    _eventMap.setEntity(entity);
    let eventName = 'data-update-' + entity.type;
    UIEvent.dispatch(eventName , {id : entity.id});
  },

  ////////////////////////////////////////////////////////////
  getData: function(type , id) {
    return _eventMap.getById(type , id);
  },

  ///////////////////////////////////////////////////////////
  getDataList: function (type , criteria) {
    const list = _eventMap.getList(type , criteria);
    return list;
  }

}

export default EventMapMananger;