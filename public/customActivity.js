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

        if (!payload.metaData) payload.metaData = {};

        if (payload.metaData && payload.metaData.save) {
            var includeSave = payload.metaData.save.includeSave;
            var saveStatusCode = payload.metaData.save.saveStatusCode;

            if (includeSave) {
                $("#includeSave").attr('checked', true);
                $("#saveStatusCode").val('');
                $("#saveStatusCode").attr('disabled', 'disabled');
            } else {
                $("#includeSave").attr('checked', false);
                $("#saveStatusCode").val(saveStatusCode);
                $("#saveStatusCode").removeAttr('disabled');
            }
        }  

        connection.on('clickedNext', onClickedNext);
        $("#includeSave").change(function() {
            if (!payload.metaData.save) payload.metaData.save = {};
            payload.metaData.save.include = $("#includeSave").is(":checked");
            if ($("#includeSave").is(":checked")) {
                $("#saveStatusCode").val("200");
                $("#saveStatusCode").removeAttr('disabled');
            } else {
                $("#saveStatusCode").attr('disabled', 'disabled');
            }
        })

        $("#saveStatusCode").change(function() {
            payload.metaData.save.statusCode = $("#saveStatusCode").val();
        })
    }

    function onClickedNext() {

        // TODO: update the url in configurationArguments based on selection in UI
        /*
        payload.configurationArguments.save.url = $("#saveUrl").val();
        payload.configurationArguments.publish.url = $("#publishUrl").val();
        payload.configurationArguments.validate.url = $("#validateUrl").val();
        payload.arguments.execute.url = $("#executeUrl").val();
        */

        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);
    }
});