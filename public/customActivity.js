define([
    'js/postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};

    $(window).ready(onRender);

    connection.on('initActivity', initialize);

    function onRender() {
        connection.trigger('ready'); // JB will respond the first time 'ready' is called with 'initActivity'
    }

    function initialize (data) {
        if (data) {
            payload = data;
        }        

        connection.on('clickedNext', onClickedNext)
    }

    function onClickedNext () {
        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);
    }
});