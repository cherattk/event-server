const DataManager = {
  getServiceList : function(){
    var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque blandit, sem aliquam consectetur commodo, neque enim tempor elit, non suscipit nisi quam vitae ipsum'
    
    return [
      { id: 's-1', name: 'service-1', host: 'www.service-1.com' , description : lorem},
      { id: 's-2', name: 'service-2', host: 'www.service-2.com', description : lorem},
      { id: 's-3', name: 'service-3', host: 'www.service-3.com', description : lorem},
    ]
  },

  getEventList : function(){
    var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque blandit, sem aliquam consectetur commodo, neque enim tempor elit, non suscipit nisi quam vitae ipsum'
    return [
      {id: 'e-1', name: 'event-1' , description : lorem},
      {id: 'e-2', name: 'event-2' , description : lorem},
      {id: 'e-3', name: 'event-3'}
    ]
  },

  getListenerList : function(){
    return [      
      {id: 'l-1', endpoint: 'listener-1'},
      {id: 'l-2', endpoint: 'listener-2'},
      {id: 'l-3', endpoint: 'listener-3'}
    ]
  }
}

export default DataManager;