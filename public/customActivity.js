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

    function initForm(metaDataObj, includeDomId, statusCodeDomId) {
        if (!metaDataObj) return;

        if (metaDataObj.include) {
            $("#" + includeDomId).attr('checked', 'checked');
            $("#" + statusCodeDomId).removeAttr('disabled');
            $("#" + statusCodeDomId).val(metaDataObj.statusCode);
        }
    }

    function metaDataUpdate(endpointProperty, includeDomId, statusCodeDomId) {
        if (!payload.metaData["save"]) payload.metaData["save"] = {};
            
        payload.metaData["save"].include = $("#includeSave").is(":checked");
        payload.metaData.save.statusCode = $("#saveStatusCode").val();

        if ($("#includeSave").is(":checked")) {
            $("#saveStatusCode").removeAttr('disabled');
        } else {
            $("#saveStatusCode").attr('disabled', 'disabled');
        }        
    }

    function initialize(data) {
        if (data) {
            payload = data;
        }

        if (!payload.metaData) payload.metaData = {};

        initForm(payload.metaData.save, "includeSave", "saveStatusCode");
        
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
            payload.configurationArguments.save = {
                "url" : "https://mcjbcustom.herokuapp.com/api/post?action=save&returnStatusCode=" + $("#saveStatusCode").val()
            }
        }  else {
            delete payload.configurationArguments.save;
        }
        
        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);
    }
});