$(function () {

  // event dispatcher url
  const dispatcher_url = 'http://localhost:3030/dispatch';

  $('#dispatch-endpoint').append(dispatcher_url);

  ///////////////////////////////////////////////////////////

  var loadListenerData = function () {
    const dataServer = 'http://localhost:3000';

    $.getJSON(dataServer, function (data) {
      var list = '';
      if(data.length){
        data.forEach(element => {
          list += '<li class="rounded-lg">';
          list += '<p><label>Listener : </label>' + element.listener + '</p>';
          list += '<p><label>Description : </label>' + element.description + '</p>';
          list += '<p><label>Original Message: </label>' + element.event_message + '</p>';
          list += '<p><label>Event Name : </label>' + element.event_name + '</p>';
          list += '<p><label>Processed message : </label>' + element.processed_data + '</p>';
          list += '</li>';
        });
      }
      else{
        list += '<li>No Listeners data</li>';
      }

      $('#listener-result').html(list);
    });
  }

  ///////////////////////////////////////////////////////
  $("#pub-form").submit(function (e) {
    e.preventDefault();
    var message = {
      event_id: e.target.elements['event_id'].value,
      message: e.target.elements['published_message'].value
    };
    $.ajax({
      type: "POST",
      url: dispatcher_url,
      data: message,
      success: function (data, textStatus) {
        loadListenerData();
      },
      error : function(error){
        console.log(error);
      }
    });
  });

  // init 
  loadListenerData();

});