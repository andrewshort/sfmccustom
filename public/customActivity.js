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

    function initialize(data) {
        if (data) {
            payload = data;
        }

        $("#urlQuickSelect").val(payload.metaData.quickselect);

        if (payload.configurationArguments) {
            $("#saveUrl").val(payload.configurationArguments.save.url);
            $("#publishUrl").val(payload.configurationArguments.publish.url);
            $("#validateUrl").val(payload.configurationArguments.validate.url);
        }  else {
            console.log('no configurationArguments in sfmccustom');
        }

        if (payload.arguments) {
            $("#executeUrl").val(payload.arguments.execute.url);
        } else {
            console.log('no arguments in sfmccustom');
        }

        connection.on('clickedNext', onClickedNext);

        $("#urlQuickSelect").change(function() {
            var selection = $(this).val();

            $("#saveUrl").val(payload.metaData[selection].save);
            $("#publishUrl").val(payload.metaData[selection].publish);
            $("#validateUrl").val(payload.metaData[selection].validate);
            $("#executeUrl").val(payload.metaData[selection].execute);

        })
    }

    function onClickedNext() {

        payload.configurationArguments.save.url = $("#saveUrl").val();
        payload.configurationArguments.publish.url = $("#publishUrl").val();
        payload.configurationArguments.validate.url = $("#validateUrl").val();
        payload.arguments.execute.url = $("#executeUrl").val();

        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);
    }
});