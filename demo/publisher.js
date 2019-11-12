$(function () {

  // event dispatcher url
  const dispatcher_url = 'http://localhost:3030/dispatch';

  $('#dispatch-endpoint').attr('href', dispatcher_url).append(dispatcher_url);

  ///////////////////////////////////////////////////////////

  var loadListenerData = function () {
    const dataServer = 'http://localhost:3000';

    $.getJSON(dataServer, function (data) {
      var list = '';
      if (data.length) {
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
      else {
        list += '<li>No Listeners data</li>';
      }

      $('#listener-result').html(list);
    });
  }

  ///////////////////////////////////////////////////////
  var submitResult = $('#submit-result');
  submitResult.click(function (e) {
    submitResult.hide();
  });

  var pubForm = $("#pub-form");
  pubForm.submit(function (e) {
    e.preventDefault();
    submitResult.attr('class' , '').html('');
    var message = {
      event_id: e.target.elements['event_id'].value,
      message: e.target.elements['published_message'].value
    };
    $.ajax({
      type: "POST",
      url: dispatcher_url,
      data: message,
      success: function (data, textStatus, xhr) {
        console.log(xhr);
        var msg = `Dispatcher Response : ${xhr.status} : ${textStatus}`;
        submitResult.attr('class' , 'alert alert-success');
        submitResult
        .html(msg)
        .append('<div class="close"><span aria-hidden="true">&times;</span></div>').show();
        loadListenerData();
      },
      error: function (error) {
        var msg = `Dispatcher Response : ${error.status} : ${error.statusText}`;
        submitResult.attr('class' ,'alert alert-danger');
        submitResult
        .html(msg)
        .append('<div class="close"><span aria-hidden="true">&times;</span></div>').show();
      }
    });
  });

  // init 
  loadListenerData();

});