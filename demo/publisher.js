$(function () {

  const dispatcher_url = 'http://localhost:8080/dispatch';

  $('#dispatch-endpoint').append(dispatcher_url);

  ///////////////////////////////////////////////////////////

  var loadListenerData = function () {
    const dataServer = 'http://localhost:3000';

    $.getJSON(dataServer, function (data) {
      var list = '';
      if(data.length){
        data.forEach(element => {
          list += '<li>';
          list += 'Listener : ' + element.listener + '<br/>';
          list += 'Description : ' + element.description + '<br/>';
          list += 'Original : ' + element.event_data + '<br/>';
          list += 'Result : ' + element.processed_data;
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