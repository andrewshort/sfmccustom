/*jshint esversion: 6 */
define([
    'js/postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var configEndpoints = ['save','validate','publish','unpublish','stop'];
    var baseUrl = "https://sfmccustom.herokuapp.com/api/post";

    var getConfigTemplate = function(configProp) {
        var configPropLabel = configProp.charAt(0).toUpperCase() + configProp.slice(1);
        return `<div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Include ` + configPropLabel +  ` Endpoint?</label>
                            <input type="checkbox" class="form-control" id="include` + configPropLabel + `" />
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>` + configPropLabel + ` Response Status Code</label>
                            <select class="form-control" id="` + configProp + `StatusCode" disabled="disabled">
                                <option value="200" selected="selected">200</option>
                                <option value="400">400</option>
                                <option value="500">500</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Respond With</label>
                            <textarea class="form-control" id="` + configProp + `ResponseBody"></textarea>
                        </div>
                    </div>
                </div>`;
    };
   
    function onRender() {
        connection.trigger('ready'); // JB will respond the first time 'ready' is called with 'initActivity'
    }

    function onGotoStep () {
        connection.trigger('updateButton', { button: 'next', text: 'done', enabled: true });
        connection.trigger('updateButton', { button: 'back', visible: false });
        connection.trigger('ready');
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

        payload.metaData = payload.metaData || {};
        payload.configurationArguments = payload.configurationArguments || {};
        payload.arguments = payload.arguments || {};
        payload.arguments.execute = payload.arguments.execute || {};

        $("#resultsDiv").html('');
        if (!payload.metaData.uid) {
            payload.metaData.uid = uniqueID();
            payload.arguments.execute.url = "https://sfmccustom.herokuapp.com/api/post?action=execute&uid=" + payload.metaData.uid;
        } 

        $.get(window.location.origin + '/api/results/' + payload.metaData.uid, function(data) {
            document.getElementById("resultsDiv").appendChild(document.createElement('pre')).innerHTML = JSON.stringify(data, null, 4);    
        });

        configEndpoints.forEach(function(configEndpoint) {
            var configPropUpper = configEndpoint.charAt(0).toUpperCase() + configEndpoint.slice(1);

            document.getElementById("configs").appendChild(document.createElement('div')).innerHTML = getConfigTemplate(configEndpoint);
            
            if (payload.configurationArguments[configEndpoint]) {
                $("#include" + configPropUpper).attr('checked', 'checked');
                $("#" + configEndpoint + "StatusCode").removeAttr('disabled');
                $("#" + configEndpoint + "StatusCode").val(payload.configurationArguments[configEndpoint].statusCode);
                $("#" + configEndpoint + "ResponseBody").val(payload.configurationArguments[configEndpoint].body);
            }

            $("#include" + configPropUpper).change(configUpdate);
            $("#" + configEndpoint + "StatusCode").change(configUpdate);
            $("#" + configEndpoint + "ResponseBody").change(configUpdate);
        });
    }

    var configUpdate = function() {
        var includeDomId = "include" + configPropUpper;
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

    function onClickedNext() {        
        payload.metaData.isConfigured = true;
        connection.trigger('updateActivity', payload);
    }

    (function(initFn) {
        var inIframe = function() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        };

        if (!inIframe()) {
            initFn({});
        }
    })(initialize);

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('gotoStep', onGotoStep);
    connection.on('clickedNext', onClickedNext);
});