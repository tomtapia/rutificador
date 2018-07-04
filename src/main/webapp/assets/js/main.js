$(function() {
  "use strict";

  var socket = window.io('/rutificador');

  function onClick(event) {
    event.preventDefault();
    routes[event.data.page].load();
    routes.forEach(function(element) {
      element.active = false;
      element.jqElement.parent().removeClass('active');
    });
    routes[event.data.page].active = true;
    routes[event.data.page].jqElement.parent().addClass('active');
  }

  var routes = [
    {
      'findByRut': {
        load: function() {
          $('.page-content').html('');
          $.get('/p/findByRut', function( data ) {
            $('.page-content').html(data);
            window.fundByRutController(socket);
          });
        },
        active: true,
        text: 'Buscar x RUT',
        jqElement: null
      }
    },
    {
      'findByName': {
        load: function() {
          $('.page-content').html('');
          $.get('/p/findByName', function( data ) {
            $('.page-content').html(data);
            window.fundByNameController(socket);
          });
        },
        active: false,
        text: 'Buscar x Nombre',
        jqElement: null
      }
    }
  ];

  routes.forEach(function(element) {
    for(var key in element) {
      if (element.hasOwnProperty(key)) {
        var page = element[key],
            uList = $('ul.side-navbar > li'),
            aLink = $(uList[page]).children().first();
        aLink.text(page.text);
        aLink.on('click', { 'page' : key }, onClick);
        if(page.active) {
          aLink.parent().addClass('active');
          page.load();
        }
        page.jqElement = aLink;
      }
    }
  });

});
