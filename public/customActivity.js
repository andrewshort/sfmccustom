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
        if (!payload.metaData[endpointProperty]) payload.metaData[endpointProperty] = {};
            
        payload.metaData[endpointProperty].include = $("#" + includeDomId).is(":checked");
        payload.metaData[endpointProperty].statusCode = $("#" + statusCodeDomId).val();

        if ($("#" + includeDomId).is(":checked")) {
            $("#" + statusCodeDomId).removeAttr('disabled');
        } else {
            $("#" + statusCodeDomId).attr('disabled', 'disabled');
        }        
    }

    function uniqueID(){
        function chr4(){
          return Math.random().toString(16).slice(-4);
        }
        return chr4() + chr4() +
          '-' + chr4() +
          '-' + chr4() +
          '-' + chr4() +
          '-' + chr4() + chr4() + chr4();
      }

    function initialize(data) {
        if (data) {
            payload = data;
        }

        if (!payload.metaData) payload.metaData = {};

        $("#resultsDiv").html('');
        if (!payload.metaData.uid) {
            payload.metaData.uid = uniqueID();
        } else {
            $.get('https://mcjbcustom.herokuapp.com/api/results/' + payload.metaData.uid, function(data) {
                $("#resultsDiv").html(JSON.stringify(data, null, 4));
            })
        }

        initForm(payload.metaData.save, "includeSave", "saveStatusCode");
        initForm(payload.metaData.validate, "includeValidate", "validateStatusCode");
        initForm(payload.metaData.publish, "includePublish", "publishStatusCode");
        initForm(payload.metaData.unpublish, "includeUnpublish", "unpublishStatusCode");
        initForm(payload.metaData.stop, "includeStop", "stopStatusCode");
        
        connection.on('clickedNext', onClickedNext);
        
        $("#includeSave").change(function() {
            metaDataUpdate("save", "includeSave", "saveStatusCode");
        })
        $("#saveStatusCode").change(function() {
            metaDataUpdate("save", "includeSave", "saveStatusCode");
        })

        $("#includeValidate").change(function() {
            metaDataUpdate("validate", "includeValidate", "validateStatusCode");
        })
        $("#validateStatusCode").change(function() {
            metaDataUpdate("validate", "includeValidate", "validateStatusCode");
        })

        $("#includePublish").change(function() {
            metaDataUpdate("publish", "includePublish", "publishStatusCode");
        })
        $("#publishStatusCode").change(function() {
            metaDataUpdate("publish", "includePublish", "publishStatusCode");
        })

        $("#includeUnpublish").change(function() {
            metaDataUpdate("unpublish", "includeUnpublish", "unpublishStatusCode");
        })
        $("#unpublishStatusCode").change(function() {
            metaDataUpdate("unpublish", "includeUnpublish", "unpublishStatusCode");
        })

        $("#includeStop").change(function() {
            metaDataUpdate("stop", "includeStop", "stopStatusCode");
        })
        $("#stopStatusCode").change(function() {
            metaDataUpdate("stop", "includeStop", "stopStatusCode");
        })
    }

    function onClickedNext() {
        var baseUrl = "https://mcjbcustom.herokuapp.com/api/post"


        setConfigArguments(payload.metaData.save, "save");
        setConfigArguments(payload.metaData.validate, "validate");
        setConfigArguments(payload.metaData.publish, "publish");
        setConfigArguments(payload.metaData.unpublish, "unpublish");
        setConfigArguments(payload.metaData.stop, "stop");

        payload.arguments.execute = 
                            {
                                "inArguments": [],
                                "outArguments": [],
                                "url": "https://mcjbcustom.herokuapp.com/api/post?action=execute&uid=" + payload.metaData.uid,
                                "useJWT": true
                            }
        
        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);
    }

    function setConfigArguments(metaDataObj, action) {
        var baseUrl = "https://mcjbcustom.herokuapp.com/api/post"
        var uid = payload.metaData.uid;

        if (metaDataObj.include) {
            payload.configurationArguments[action] = {
                "url" : baseUrl + "?action=" + action + "&uid=" + uid + "&returnStatusCode=" + metaDataObj.statusCode + "&timeout=0"
            }
        }  else {
            delete payload.configurationArguments[action];
        }
    }
});