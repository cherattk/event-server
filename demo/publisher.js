$(function() {

  const dispatcher_url = 'http://localhost:8080/dispatch';

  $('#dispatch-endpoint').append(dispatcher_url);


  ///////////////////////////////////////////////////////
  $( "#pub-form" ).submit(function(e){
    e.preventDefault();
    var message = {
      event_id : e.target.elements['event_id'].value,
      message : e.target.elements['published_message'].value
    };
    $.ajax({
      type: "POST",
      url: dispatcher_url,
      dataType: 'json',
      data: message,
      success: function(data , textStatus){
        console.log(data);
      },
    });
  });
  
  ///////////////////////////////////////////////////////
  $('#get-listener-result').click(function(){
    alert('test');
  });

});