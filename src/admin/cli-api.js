/**
 * 
 */
const path = require('path');
const MapFilePath = path.resolve('./config/event-map.json');
const EventLoader = require('../core/event-loader')(MapFilePath);
const _EventMap = require('../core/event-map');
const eventMap = new _EventMap(EventLoader);

const prompt = require('prompt');
      prompt.message = 'eser >';

const promptQuestion = require('./prompt-questions');

function _assign(target, source) {
  var targetKey = Object.keys(target);
  targetKey.map((key) => {
    if ((typeof source[key] !== 'undefined') && source[key]) {
      target[key] = source[key];
    }
  });
}

function _genEntity(entityType, promptValue) {

  if (entityType === 'service') {
    return {
      type: entityType,
      name: promptValue.service_name,
      domain: promptValue.service_domain
    }
  }
  if (entityType === 'event') {
    return {
      type: entityType,
      service_id: promptValue.service_id,
      name: promptValue.event_name,
    }
  }
  if (entityType === 'listener') {
    return {
      type: entityType,
      service_id: promptValue.service_id,
      event_id: promptValue.event_id,
      name: promptValue.listener_name,
      path: promptValue.listener_path
    }
  }
}


function _displayData(message , data){
  var bar = '='.repeat(message.length + 2);
  console.log(bar);
  console.log(`${message} :`);
  console.log(bar);
  console.table(data);
}

module.exports = {

  fetchDisplayItem : function (entityType, entityID) {
    // fetch
    let entityData = eventMap.getById(entityType, entityID);
    if (entityData) {
      // display entity data
      console.table([entityData]);
      return entityData;
    }
    else {
      console.log('=============== error =============');
      console.log(`${entityType} with id : ${entityID} not found`);
      return false;
    }
  },

  setEntity: function (entityType, entityID) {

    var entityData;
    if(entityID){
      entityData = this.fetchDisplayItem(entityType, entityID);
      if(!entityData){
        return;
      }
    };

    const questions = promptQuestion.entityField[entityType];
    // user input
    prompt.start({ noHandleSIGINT: true });
    prompt.get(questions, function (err, promptValue) {
      if (!promptValue) {
        return;
      }

      const entity = _genEntity(entityType, promptValue);

      var _error;

      if (entityData) {
        // merge the new value with old value
        // save entity
        _assign(entityData, entity);
        try {
          eventMap.set(entityData);
        } catch (exception) {
          console.log(exception.message);
          _error = true;
        }
      } 
      else {
        try {
          eventMap.set(entity);
        } catch (exception) {
          console.log(exception.message);
          _error = true;
        }
      }

      if(!_error){
        var list = eventMap.getList(entity.type);
        if(list.length){
          _displayData(`${entity.type} list`, list);
        }
      }

    });
  },

  getEntity: function (entityType, entityField) {

    var entityDataList = eventMap.getList(entityType, entityField);

    if (entityDataList.length) {
      console.table(entityDataList);
    }
    else {
      console.log('not found list');
    }
  },

  removeEntity: function (entityType, entityID) {

    var result = eventMap.removeById(entityType, entityID);
    console.table([
      {
        'type': entityType,
        'id': entityID,
        'deleted': result,
      }
    ]);
  }

} // exports