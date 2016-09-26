$(function() {
  var socket = io('/rutificador');

  var routes = [
    {
      load: function() {
        $('.page-content').html('');
        $.get('/p/findByRut', function( data ) {
          $('.page-content').html(data);
          fundByRutController(socket);
        });
      },
      active: true,
      text: 'Buscar x RUT'
    },
    {
      load: function() {
        // ToDo: Comming soon.
        $('.page-content').html('<p>Comming soon.</p>');
      },
      active: false,
      text: 'Buscar x Nombre'
    },
    {
      load: function() {
        // ToDo: Comming soon.
        $('.page-content').html('<p>Comming soon.</p>');
      },
      active: false,
      text: 'Validar Documento'
    }
  ];

  for(var page in routes) {
    var uList = $('ul.side-navbar').first(),
        list = $('<li role="presentation"></li>').first(),
        aLink = $('<a href="#"></a>').first();
    aLink.attr('data-page', page);
    aLink.text(routes[page].text);
    aLink.on('click', function(event) {
      event.preventDefault();
      routes[event.target.dataset.page].load();
    });
    if(routes[page].active) {
      aLink.addClass('active');
      routes[page].load();
    }
    list.append(aLink);
    uList.append(list);
  }

});
