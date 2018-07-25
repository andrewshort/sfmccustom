define([
    'js/postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var currentStep = null;
    var initialized = false;

    var steps = [
        {  "label": "Publish", "key": "step1" },
        //{  "label": "Execute", "key": "step2" },
        {  "label": "Results", "key": "step3" }
        ];

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('gotoStep', onGotoStep);
    connection.on('clickedBack', onClickedBack);
    connection.on('clickedNext', onClickedNext);

    function onRender() {
        connection.trigger('ready'); // JB will respond the first time 'ready' is called with 'initActivity'
    }

    function onGotoStep (step) {
        showStep(step);
        connection.trigger('ready');
    }

    function onClickedBack () {        
        connection.trigger('prevStep');
    }

    function showStep(step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex-1];
        }
        
        if( initialized ) {
            if( !currentStep || ( step && currentStep.key !== step.key ) ) {
                connection.trigger('gotoStep', step);
            }    
        }

        currentStep = step;
        
        $('.step').hide();

        switch(step.key) {
            case 'step1':
                $('#step1').show();
                connection.trigger('updateButton', { button: 'next', enabled: true });
                connection.trigger('updateButton', { button: 'back', visible: false });
                break;
            case 'step2':
                $('#step2').show();
                connection.trigger('updateButton', { button: 'next', enabled: true });
                connection.trigger('updateButton', { button: 'back', visible: true });
                break;
            case 'step3':
                $('#step3').show();
                connection.trigger('updateButton', { button: 'back', visible: true });
                connection.trigger('updateButton', { button: 'next', text: 'done', visible: true });
                break;
        }
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
        initialized = true;
        if (data) {
            payload = data;
        }

        if (!payload.metaData) payload.metaData = {};

        $("#resultsDiv").val('');
        if (!payload.metaData.uid) {
            payload.metaData.uid = uniqueID();
            payload.arguments.execute = 
                            {
                                "inArguments": [],
                                "outArguments": [],
                                "url": "https://mcjbcustom.herokuapp.com/api/post?action=execute&uid=" + payload.metaData.uid,
                                "useJWT": true
                            }
        } else {
            showStep(null, 3);
            $.get('https://mcjbcustom.herokuapp.com/api/results/' + payload.metaData.uid, function(data) {
                
                $("#resultsDiv").html('');

                document.getElementById("resultsDiv").appendChild(document.createElement('pre')).innerHTML = JSON.stringify(data, null, 4);    
         
            })
        }

        initForm(payload.metaData.save, "includeSave", "saveStatusCode");
        initForm(payload.metaData.validate, "includeValidate", "validateStatusCode");
        initForm(payload.metaData.publish, "includePublish", "publishStatusCode");
        initForm(payload.metaData.unpublish, "includeUnpublish", "unpublishStatusCode");
        initForm(payload.metaData.stop, "includeStop", "stopStatusCode");
        
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
        if (!currentStep || currentStep.key != "step3") {
            connection.trigger('nextStep');
            return;
        }

        setConfigArguments(payload.metaData.save, "save");
        setConfigArguments(payload.metaData.validate, "validate");
        setConfigArguments(payload.metaData.publish, "publish");
        setConfigArguments(payload.metaData.unpublish, "unpublish");
        setConfigArguments(payload.metaData.stop, "stop");
        
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