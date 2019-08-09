/**
 * @module DataManager
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

var _eventMap = null;

const DataManager = {

  setEventMap: function (EventMap) {
    if (_eventMap) {
      return;
    }
    _eventMap = EventMap;
  },

  getServiceList: function () {
    const list = _eventMap.getList('service');
    return list;
  },

  getEventList: function () {
    const list = _eventMap.getList('event');
    return list;
  },

  getListenerList: function () {
    const list = _eventMap.getList('listener');
    return list;
  }
}

export default DataManager;