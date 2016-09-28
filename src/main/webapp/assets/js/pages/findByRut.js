
var fundByRutController = function(socket) {
  // Initialize variables
  var $window = $(window),
      $roomIdLabel = $('.roomIdLabel'),
      $inputRut = $('.inputRut'),
      $resultPanel = $('.resultPanel');
      $errorPanel = $('.errorPanel'),
      $errorTextPanel = $('.errorTextPanel');

  // Prompt for setting a username
  var roomId = false,
      connected = false;

  var viewHelper = {
    setDataOnView: function(elem, text) {
      $('span.' + elem).parent().show();
      $('span.' + elem).text(text);
    },
    cleanResult: function() {
      $errorPanel.hide();
      $('ul.list-group > li').each(function(index, element) {
        $(element).children('spam').first().text('');
        $(element).hide();
      });
      $resultPanel.hide();
    },
    successDataInput: function() {
      var input = $('input.inputRut'),
          spanIcon = $('<span />');
      input.parent().removeClass('has-error');
      input.parent().children('span').remove();
      input.parent().addClass('has-success has-feedback');
      spanIcon.addClass('glyphicon glyphicon-ok form-control-feedback');
      spanIcon.attr('aria-hidden', true);
      input.after(spanIcon);
    },
    errorDataInput: function() {
      var input = $('input.inputRut'),
          spanIcon = $('<span />');
      input.parent().removeClass('has-success');
      input.parent().children('span').remove();
      input.parent().addClass('has-error has-feedback');
      spanIcon.addClass('glyphicon glyphicon-remove form-control-feedback');
      spanIcon.attr('aria-hidden', true);
      input.after(spanIcon);
    },
  };

  socket.on('new roomId', function (data) {
    roomId = data;
    $roomIdLabel.text(roomId);
  });

  socket.on('rut info resp', function (data) {
    var rut = new Rut(data.rut);
    $resultPanel.show();
    viewHelper.setDataOnView('rut', rut.getNiceRut());
    viewHelper.setDataOnView('name', data.name.name);
    viewHelper.setDataOnView('pname', data.name.pname);
    viewHelper.setDataOnView('mname', data.name.mname);
  });

  socket.on('rut status resp', function (data) {
    var rut = new Rut(data.rut);
    $resultPanel.show();
    viewHelper.setDataOnView('status', data.status);
  });

  socket.on('throw error', function (err) {
    $errorPanel.show();
    $errorTextPanel.text(err.message);
  });

  $('form[name="rutInfo"]').on('submit', function(event) {
    event.preventDefault();
    viewHelper.cleanResult();
    var rut = new Rut($inputRut.val());
    if (rut.isValid) {
      viewHelper.successDataInput();
      var data = {rut:rut.getNiceRut(false)};
      socket.emit('rut info', data);
      socket.emit('rut status', data);
    } else {
      viewHelper.errorDataInput();
      $errorPanel.show();
      $errorTextPanel.text('El RUT ingresado no es valido.');
    }
  });

  $('button.alertClose').on('click', function(event) {
    event.preventDefault();
    $errorTextPanel.text('');
    $errorPanel.hide();
  });

  $inputRut.focus();
  viewHelper.cleanResult();
  if(!roomId) {
    socket.emit('join', roomId);
  }

};
