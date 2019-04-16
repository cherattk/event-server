
function Persistence(dbDriver) {

  const __dbDriver = dbDriver;

  this.saveEvent = function(event) {
    return __dbDriver.insert(event);
  }
  
  this.getEvent = function(criteria) {
    return __dbDriver.get(criteria);
  }
  
  this.saveError = function(error) {
    return __dbDriver.insert(error);
  }
  
  this.getError = function(criteria) {
  }
}

module.exports = function(dbDriver){
  // const nano = require('nano');
  return new Persistence(dbDriver);
}