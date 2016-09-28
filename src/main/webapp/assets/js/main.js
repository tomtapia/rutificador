$(function() {
  var socket = io('/rutificador');

  function onClick(event) {
    event.preventDefault();
    routes[this.dataset.page].load();
    routes.forEach(function(element, index, array) {
      element.active = false;
      element.jqElement.parent().removeClass('active');
    });
    routes[this.dataset.page].active = true;
    routes[this.dataset.page].jqElement.parent().addClass('active');
  }

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
      text: 'Buscar x RUT',
      jqElement: null
    },
    {
      load: function() {
        // ToDo: Comming soon.
        $('.page-content').html('<p>Comming soon.</p>');
      },
      active: false,
      text: 'Buscar x Nombre',
      jqElement: null
    }
  ];

  for(var page in routes) {
    var uList = $('ul.side-navbar > li'),
        aLink = $(uList[page]).children().first();
    aLink.attr('data-page', page);
    aLink.text(routes[page].text);
    aLink.on('click', onClick);
    if(routes[page].active) {
      aLink.parent().addClass('active');
      routes[page].load();
    }
    routes[page].jqElement = aLink;
  }

});
