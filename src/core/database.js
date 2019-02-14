module.exports = function Database(config) {

  const __conn = require('nano')(config.url);
  const __db = __conn.use(config.db);

  this.init = function () {

  }

  this.push = function (entity) {
    return id;
  }

  this.remove = function (id) {
    return id;
  }

  this.getById = function (id) {
    __db.get(id).then((body) => {
      console.log(body);
    });
  }

  this.getList = function (entityType, range) {

  }
}