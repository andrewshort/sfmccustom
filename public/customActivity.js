/*jshint esversion: 6 */
define([
    'js/postmonger',
    'js/util',
    'js/templateHelper'
], function(
    Postmonger,
    Util,
    TemplateHelper
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var configEndpoints = ['save','validate','publish','unpublish','stop'];
    var baseUrl = window.location.origin + "/api/post";

    function initialize(data) {
        if (data) {
            payload = data;
        }

        Util.initPayload(payload);

        if (!payload.metaData.uid) {
            payload.metaData.uid = Util.uniqueID();
            payload.arguments.execute.url = baseUrl + "?action=execute&uid=" + payload.metaData.uid;
        } 

        $.get(window.location.origin + '/api/results/' + payload.metaData.uid, function(data) {
            document.getElementById("resultsDiv").appendChild(document.createElement('pre')).innerHTML = JSON.stringify(data, null, 4);    
        });

        configEndpoints.forEach(function(configEndpoint) {
            document.getElementById("configs").appendChild(document.createElement('div')).innerHTML = TemplateHelper.getConfigTemplate(configEndpoint);

            TemplateHelper.updateTemplate(payload, configEndpoint);

            var configUpdate = function() {
                var includeDomId = "include" + Util.upper(configEndpoint);
                var statusCodeDomId = configEndpoint + "StatusCode";
                var responseBodyDomId = configEndpoint + "ResponseBody";
                var uid = payload.metaData.uid;
            
                if ($("#" + includeDomId).is(":checked")) {
                    $("#" + statusCodeDomId).removeAttr('disabled');
                    $("#" + responseBodyDomId).removeAttr('disabled');
        
                    payload.configurationArguments[configEndpoint] = payload.configurationArguments[configEndpoint] || {};
        
                    var statusCode = $("#" + statusCodeDomId).val();
                    var responseBody = $("#" + responseBodyDomId).val();
        
                    payload.configurationArguments[configEndpoint].statusCode = statusCode;
                    payload.configurationArguments[configEndpoint].url = baseUrl + "?action=" + configEndpoint + "&uid=" + uid + "&returnStatusCode=" + statusCode + "&timeout=0";
        
                    if (responseBody) {
                        payload.configurationArguments[configEndpoint].body = responseBody;
                    } else {
                        delete payload.configurationArguments[configEndpoint].body;
                    }
                } else {
                    $("#" + statusCodeDomId).attr('disabled', 'disabled');
                    $("#" + responseBodyDomId).attr('disabled', 'disabled');
        
                    delete payload.configurationArguments[configEndpoint];
                }        
            };

            $("#include" + Util.upper(configEndpoint)).change(configUpdate);
            $("#" + configEndpoint + "StatusCode").change(configUpdate);
            $("#" + configEndpoint + "ResponseBody").change(configUpdate);
        });
    }

    function onClickedNext() {        
        payload.metaData.isConfigured = true;
        connection.trigger('updateActivity', payload);
    }

    // This is for debugging locally when there is no initActivity postmonger signal
    (function(initFn) {
        if (!Util.inIFrame()) {
            initFn({});
        }
    })(initialize);

    $(window).ready(function() {
        connection.trigger('ready'); // JB will respond the first time 'ready' is called with 'initActivity'
    });

    connection.on('initActivity', initialize);
    connection.on('clickedNext', onClickedNext);
});