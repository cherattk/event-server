/**
 * @module Controller
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

const EventMap = require("./eventmap.js");

function Controller() {

  const __eventMap = new EventMap();

  this.validRequestParam = function (request, checkList) {
    var ok = true;
    checkList.map(function (prop) {
      ok = ok && (typeof request[prop] !== "undefined");
    });
    return ok;
  }

  this.registerEntity = function (Request, Response) {

    var params = Object.assign({}, Request.body);

    var ok = this.validRequestParam(params , [ "type" , "name"]);
    if (ok) {
      var id = __eventMap.add({
        type : params.type,
        name : params.name,
      });
  
      Response.status(201).json({
        status : true,
        entity_id : id
      });
      return;
    }

    Response.status(401).end();
    
  }

  this.removeEntity = function (Request, Response) {

    var params = Object.assign({}, Request.query);
    var ok = this.validRequestParam(params , [ "type" , "id"]);
    if (ok) {
      var result = __eventMap.removeById(params.type , params.id);
      var statusCode = result ? 200 : 404;
      Response.status(statusCode).json({
        status : result
      });
      return;
    }

    Response.status(401).end();

  }

  this.getEntity = function (Request, Response) {

    var params = Object.assign({}, Request.query);
    var ok = this.validRequestParam(params , [ "type" , "id"]);
    if (ok) {
      var result = __eventMap.getById(params.type , params.id);
      var statusCode = result ? 200 : 404;
      Response.status(statusCode).json({
        entity : result
      });
      return;
    }

    Response.status(401).end();
  }

  this.dispatchEvent = function (eventID, eventMessage) {

    var message = {
      event: eventID,
      message: eventMessage
    };

    var __listener = this.getByParentId(eventID);
    __listener.forEach(function (listener) {
      console.log("call listener " + listener.id + " , message : " + eventMessage);
    });

    return true;

  }

}

module.exports = Controller;
