/*jshint esversion: 6 */
define([
    'js/postmonger',
    'js/util',
    'js/templateHelper',
    'js/payloadHelper'
], function(
    Postmonger,
    Util,
    TemplateHelper,
    PayloadHelper
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var baseUrl = window.location.origin + "/api/post";
    var currentStep = '';
    var initialized = false;

    function initialize(data) {
        if (data) {
            payload = data;
        }

        $(".step").hide();
        $("#step1").show();
        currentStep = 'step1';

        Util.initPayload(payload, baseUrl);

        $.get(window.location.origin + '/api/results/' + payload.metaData.uid, function(data) {
            document.getElementById("resultsDiv").appendChild(document.createElement('pre')).innerHTML = JSON.stringify(data, null, 4);    
        });

        ['save','validate','publish','unpublish','stop'].forEach(function(configEndpoint) {
            document.getElementById("configs").appendChild(document.createElement('div')).innerHTML = TemplateHelper.getConfigTemplate(configEndpoint);

            TemplateHelper.updateTemplate(payload, configEndpoint);

            var configUpdate = TemplateHelper.configUpdate(configEndpoint, PayloadHelper.updatePayloadFromUiObject(payload, baseUrl));

            $("#include" + Util.upper(configEndpoint)).change(configUpdate);
            $("#" + configEndpoint + "StatusCode").change(configUpdate);
            $("#" + configEndpoint + "ResponseBody").change(configUpdate);
        });

        if (currentStep) {
            $(".step").hide();
            $("#" + currentStep).show();
        }
    }    

    function onClickedNext() {     
        if (currentStep === 'step1') {
            $(".step").hide();
            $("#step2").show();
            currentStep = 'step2';
        }  else {
            payload.metaData.isConfigured = true;
            connection.trigger('updateActivity', payload);
        }        
    }

    function onGotoStep(step) {
        if (!step)  {
            console.log('step key not provided');
            return;
        }

        currentStep = step;
        if (initialized) {
            $(".step").hide();
            $("#" + currentStep).show();  
        } 

        connection.trigger('ready');
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
    connection.on('gotoStep', onGotoStep);
});