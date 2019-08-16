/**
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

module.exports = function (eventMapFile, Logging) {

  const _eventMapFile = eventMapFile;
  const _logging = Logging;

  // @see nano package docs at https://www.npmjs.com/package/nano#dbfindselector-callback
  // @see couchDB docs at https://docs.couchdb.org/en/2.3.1/api/database/find.html
  const _findCriteria = {
    selector: {
      tag: { "$eq": "" }
    },
    limit: 30
  };;

  return {

    getEventMap: function (Request, Response) {
      Response.json(require(_eventMapFile));
    },

    /**
     * @todo validate query params
     */
    getActivity: function (Request, Response) {

      let activityTag = Request.query.tag || '';
      if(!activityTag){
        Response.status(400).json({
          message : `bad request : you need to provide activity's tag value`
        });
        return;
      }
      let criteria = Object.assign({} , _findCriteria);
      criteria.selector.tag = { "$eq": activityTag };

      _logging.fetch(criteria).then(function (result) {
        // todo : the results must be formated by a method implemented by the driver
        // ex :  couchDBDriver.format(result) : Array<data : Object>

        Response.json({
          activity : activityTag,
          data : result.docs
        });
      });

    },

    saveEventMap: function () { }


  }
}