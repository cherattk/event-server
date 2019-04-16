/**
 * @module EventManager
 * @copyright Copyright (c) 2018-2019 cheratt karim
 * @license MIT Licence
 */

const __httpMethod = {
  post : {
    service  : ['type' , 'name'],
    event    : ['type' , 'name' , 'service_id'],
    listener : ['type' , 'name' , 'service_id' , 'event_id' , 'url']
  },
  get : {
    service  : ['type' , 'id'],
    event    : ['type' , 'id'],
    listener : ['type' , 'id']
  },
  delete : {
    service  : ['type' , 'id'],
    event    : ['type' , 'id'],
    listener : ['type' ,  'id']
  }
}

function EventManager(EventMap) {

  const __eventMap = EventMap ;

  this.checkField = function (requiredField , requestField) {
    var ok = true;
    requiredField.map(function (prop) {
      ok = ok && (typeof requestField[prop] !== "undefined");
    });
    return ok;
  }

  this.isValidQuery = function(method , query){

    var requiredField = __httpMethod[method][query.type];
    // check if query contains required fields
    var result = this.checkField(requiredField , query);
    return result;
  }

  this.checkQueryEntity = function(Request, Response , Next) {
    var query = Object.assign({}, Request.body || Request.query);
    if(typeof query.type === "undefined" ||
        ['service' , 'event' , 'listener'].indexOf(query.type) < 0){
        Response.status(400).end();          
        return false;
    }
    Response.status(200);    
    // Call the next middleware
    Next();
  }

  this.registerEntity = function (Request, Response) {

    var query = Object.assign({}, Request.body);
    if (!this.isValidQuery('post' , query)) {
      Response.status(400).end();
      return;
    }
    var id = __eventMap.add(query);
    Response.status(201).json({ entity_id : id });    
    
  }

  this.removeEntity = function (Request, Response) {

    var query = Object.assign({}, Request.body);

    if (!this.isValidQuery('delete' , query)) {
      Response.status(400).end();
      return;
    }

    var result = __eventMap.removeById(query.type , query.id);
    var statusCode = result ? 200 : 404;
    Response.status(statusCode).json({
      status : result
    });
  }

  this.getEntity = function (Request, Response) {

    var query = Object.assign({}, Request.query);
    if (!this.isValidQuery('get' , query)) {
      Response.status(400).end();
      return;
    }

    var result;
    if(query.id){
      result = __eventMap.getById(query.type , query.id);
    }
    else{
      result = __eventMap.getList(query.type);
    }
    var statusCode = result ? 200 : 404;
    var data = statusCode === 200 ?  { data : result } : { message : "not found"};
    Response.status(statusCode).json(data);
  }

}

module.exports = function(__EventMap){
  return new EventManager(__EventMap);
};
