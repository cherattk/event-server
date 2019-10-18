// import ReactDOM from 'react-dom';

// const EventMapManager  = require('./event-map-manager');
// const EventMap = require('./event-map');
// const AdminerConfig = require('../adminer.config');

const Misc = {

  getCookie : function(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },

  setCookie : function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },

  getDateFormat : function(time) {
    let _time = new Date(time);
    let result = _time.toLocaleDateString() + ' - ' + _time.toLocaleTimeString();
    return result;
  },

  LoadApp : function() {
    
  }

};

module.exports = Misc;