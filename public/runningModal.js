define([
    'js/postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();

    $(window).ready(onRender);

    function onRender() {
        connection.trigger('ready'); 

        $('#close').click(function(){
            connection.trigger('destroy');
        });
    }
});