
var fundByRutController = function(socket) {
  // Initialize variables
  var $window = $(window),
      $roomIdLabel = $('.roomIdLabel'),
      $inputRut = $('.inputRut'),
      $resultPanel = $('.resultPanel');
      $errorPanel = $('.errorPanel'),
      $errorTextPanel = $('.errorTextPanel');

  // Prompt for setting a username
  var roomId = false;
  var connected = false;

  $inputRut.focus();
  $errorPanel.hide();
  $resultPanel.hide();

  if(!roomId) {
    socket.emit('join', roomId);
  }

  socket.on('new roomId', function (data) {
    console.log("New RoomID Received", data);
    roomId = data;
    $roomIdLabel.text(roomId);
  });

  socket.on('rut info resp', function (data) {
    console.log("RUT Info Received", data);
    var rut = new Rut(data.rut);
    $resultPanel.show();
    $('span.rut').text(rut.getNiceRut());
    $('span.name').text(data.name.name);
    $('span.pname').text(data.name.pname);
    $('span.mname').text(data.name.mname);
  });

  socket.on('throw error', function (err) {
    console.log("Horror:", err);
    $errorPanel.show();
    $errorTextPanel.text(err.message);
  });

  $('form[name="rutInfo"]').on('submit', function(event) {
    event.preventDefault();
    var rut = new Rut($inputRut.val());
    $errorPanel.hide();
    $resultPanel.hide();
    if ( rut.isValid ) {
      console.log('Inpuit RUT: ' + rut.getNiceRut());
      socket.emit('rut info', {rut:rut.getNiceRut(false)});
    } else {
      $errorPanel.show();
      $errorTextPanel.text('El RUT ingresado no es valido.');
    }
  });

  $('button.alertClose').on('click', function(event) {
    event.preventDefault();
    $errorTextPanel.text('');
    $errorPanel.hide();
  });

};
