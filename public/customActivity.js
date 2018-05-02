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

        $("#includeSave").removeAttr('checked');
        $("#saveStatusCode").val("200");
        $("#saveStatusCode").attr('disabled', 'disabled');

        if (payload.metaData && payload.metaData.save) {
            var include = payload.metaData.save.include;
            var statusCode = payload.metaData.save.statusCode;

            if (include) {
                $("#includeSave").attr('checked', 'checked');
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

        if (payload.metaData.save.include) {
            payload.configurationArguments.save = "https://mcjbcustom.herokuapp.com/api/post?action=save&returnStatusCode=" & $("#saveStatusCode").val()
        }
        
        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);
    }
});