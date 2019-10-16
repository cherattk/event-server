

const Misc = {

  getDateFormat(time) {
    let _time = new Date(time);
    let result = _time.toLocaleDateString() + ' - ' + _time.toLocaleTimeString();
    return result;
  }

};

module.exports = Misc;