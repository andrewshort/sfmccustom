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

    var token;
    var endpointUrls;

    function initialize(data) {
        if (data) {
            payload = data;
        }

        $(".step").hide();
        $("#step1").show();
        currentStep = 'step1';

        $(".jumbotron").click(function() {
            connection.trigger('requestTokens');
        });

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

        $("#executeStatusCode").val(payload.arguments.execute.inArguments[0].returnStatusCode);
        $("#executeStatusCode").change(function() {
            payload.arguments.execute.inArguments[0].returnStatusCode = $(this).val();
        });

        $("#dateInputByUser").val(payload.arguments.execute.inArguments[2].dateInputByUser);
        $("#dateInputByUser").change(function() {
            payload.arguments.execute.inArguments[2].dateInputByUser = $(this).val();
        });

        var executeObj = payload.arguments.execute;
        if (executeObj && executeObj.securityOptions && executeObj.securityOptions.securityContextKey) {
            $("#securityContextKey").val(executeObj.securityOptions.securityContextKey);    
        }
        $("#securityContextKey").change(function() {
            var secKey = $(this).val();
            if (secKey === '') {
                delete payload.arguments.execute.securityOptions;
            } else {
                payload.arguments.execute.securityOptions = {
                    securityType: "securityContext",
                    securityContextKey: secKey
                }
            }
        });

        if (executeObj && executeObj.useJwt) {
            $("#useJwt").attr('checked', 'checked');
        } else {
            $("#useJwt").removeAttr('checked');
        }

        $("#useJwt").change(function() {
            var useJwt = $(this).is(":checked");

            executeObj.useJwt = useJwt;
        });

        if (currentStep) {
            showCurrentStep();
        }
    }    

    function onClickedNext() {     
        if (currentStep === 'step1') {
            $(".step").hide();
            $("#step2").show();
            currentStep = 'step2';
            connection.trigger('nextStep');
        }  else {
            payload.metaData.isConfigured = true;
            connection.trigger('updateActivity', payload);
        }        
    }

    function onClickedBack() {
            $(".step").hide();
            $("#step1").show();
            currentStep = 'step1';
            connection.trigger('prevStep');
    }

    function onGotoStep(step) {
        if (!step)  {
            console.log('step key not provided');
            return;
        }

        currentStep = step;
        if (step.key) {
            currentStep = step.key;
        }

        if (initialized) {
              showCurrentStep();
        } 

        connection.trigger('ready');
    }

    function showCurrentStep() {
        if (!currentStep) {
            console.log('currentStep undefined');
            return;
        }

        $(".step").hide();
        $("#" + currentStep).show();


        if (currentStep == 'step2') {
            updateButton('next', 'Next', true);
        } else {
            updateButton('next', 'Done', true);
        }
        
        updateButton('back', 'Back', currentStep == 'step2');
    }

    function updateButton(button, text, visible) {
        connection.trigger('updateButton', {
            button: button,
            visible: visible,
            text: text
        });
    }

    function onGetTokens (tokens) {
        token = tokens.fuel2token;
        connection.trigger('requestEndpoints');
        console.log(tokens);
    }

    function onGetEndpoints(endpoints) {
        endpointUrls = endpoints;
        console.log(endpoints);

        var restEndpoint = endpointUrls.fuelapiRestHost;
        var tseEndpointUrl = restEndpoint + "platform/v1/endpoints";

        $.ajax({
            url: '/api/fuelproxy',
            type: 'post',
            data: {
                proxyUrl : encodeURIComponent(tseEndpointUrl)
            },
            headers: {
                "Authorization" : "Bearer " + token
            },
            dataType: 'json',
            success: function(data) { 
                console.log(data);
            }
         });
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
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
});