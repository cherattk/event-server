/**
 *
 * @module CouchDBWrapper A wrapper Object
 * 
 */

const nano = require('nano');

module.exports = function CouchDBWrapper(db_address){

  const _nano = nano(db_address);

  return {

    insert : function(data){
      return _nano.insert(data);
    },
  
    fetch : function(criteria){
      return _nano.find(criteria);
    }
  }

}