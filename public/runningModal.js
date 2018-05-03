define([
    'js/postmonger'
], function(
    Postmonger
) {
    'use strict';

    var payload = {};

    var connection = new Postmonger.Session();

    $(window).ready(onRender);
    connection.on('initActivityRunningModal', initialize);

    function onRender() {
        connection.trigger('ready'); 

        $('#close').click(function(){
            connection.trigger('destroy');
        });
    }

    function initialize(data) {
        payload = data;

        $.get('https://mcjbcustom.herokuapp.com/api/results/' + payload.metaData.uid, function(data) {
                
                $("#resultsDiv").html('');

                document.getElementById("resultsDiv").appendChild(document.createElement('pre')).innerHTML = JSON.stringify(data, null, 4);    
         
            });
    }

});