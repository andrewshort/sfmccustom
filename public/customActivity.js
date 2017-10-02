define([
    'js/postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Step 1", "key": "step1" },
        { "label": "Step 2", "key": "step2" },
        { "label": "Step 3", "key": "step3" },
        { "label": "Step 4", "key": "step4", "active": false }
    ];
    var currentStep = null;
    var initialized = false;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedSchema', onGetSchema);
    connection.on('requestedCulture', onGetCulture);
    connection.on('requestedInteractionDefaults', onGetInteractionDefaults);

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

    connection.on('requestedInteraction', function(ixn) {
        $('body').append('Interaction Version: ' + ixn.version);
    });

    function onRender() {
        connection.trigger('ready'); // JB will respond the first time 'ready' is called with 'initActivity'

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestSchema');
        connection.trigger('requestCulture');
        connection.trigger('requestInteractionDefaults');
        connection.trigger('requestInteraction');

        // Disable the next button if a value isn't selected
        $('#select1').change(function() {
            var message = getMessage();
            connection.trigger('updateButton', { button: 'next', enabled: Boolean(message) });

            $('#message').html(message);
        });

        // Toggle step 4 active/inactive (if inactive, wizard hides it and skips over it during navigation
        $('#toggleLastStep').click(function() {
            lastStepEnabled = !lastStepEnabled; // toggle status
            steps[3].active = !steps[3].active; // toggle active

            connection.trigger('updateSteps', steps);
        });

        $('#payload').on('change',onPayloadChanged);
        $('#payload').on('keyup',onPayloadChanged);
    }

    function initialize (data) {
        initialized = true;

        if (data) {
            payload = data;

            $( '#initialPayload' ).text( JSON.stringify( data , null , 4 ) );
        } else {
            $( '#initialPayload' ).text( 'initActivity contained no data' );
        }

        var message;
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        $.each(inArguments, function(index, inArgument) {
            $.each(inArgument, function(key, val) {
                if (key === 'message') {
                    message = val;
                }
            });
        });

        if (message) {
            // If there is a message, fill things in, and if no default was specified, jump to last step
            $('#select1').find('option[value='+ message +']').attr('selected', 'selected');
            $('#message').html(message);
            showStep(null, 3);
        } else {
            showStep(null, 1);
        }

    }

    function onGetInteractionDefaults (interactionDefaults) {
        if(interactionDefaults){
            $( '#interactionDefaults').text( JSON.stringify( interactionDefaults, null, 4) );
        } else {
            $( '#interactionDefaults').text( 'There are currently no event defaults.');
        }
    }

    function onGetTokens (tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        // console.log(tokens);
    }

    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        // console.log(endpoints);
        $( '#endpoints' ).text( JSON.stringify( endpoints , null , 4 ) );
    }

    function onGetSchema (getSchemaPayload) {
        // Response: getSchemaPayload == { schema: [ ... ] };
        // console.log('requestedSchema payload = ' + JSON.stringify(getSchemaPayload, null, 2));
        $( '#schema' ).text( JSON.stringify( getSchemaPayload , null , 4 ) );
    }

    function onGetCulture (culture) {
        // Response: culture == 'en-US'; culture == 'de-DE'; culture == 'fr'; etc.
        // console.log('requestedCulture culture = ' + JSON.stringify(culture, null, 2));
        $( '#culture' ).text( JSON.stringify( culture , null , 4 ) );
    }

    function onClickedNext () {
        if ((currentStep.key === 'step3' && steps[3].active === false) || currentStep.key === 'step4') {
            save();
        } else {
            connection.trigger('nextStep');
        }
    }

    function onClickedBack () {
        connection.trigger('prevStep');
    }

    function onGotoStep (step) {
        showStep(step);
        connection.trigger('ready');
    }

    function onPayloadChanged() {
        if(currentStep && currentStep.key === 'step3') {
            try {
                payload = JSON.parse($('#payload').val());
                updateStep3NextButton(true);
            } catch( e ) {
                updateStep3NextButton(false);
            }
        }
    }

    function updateStep3NextButton(isValid) {
        if (lastStepEnabled) {
            connection.trigger('updateButton', { button: 'next', text: 'next', visible: true, enabled: isValid });
        } else {
            connection.trigger('updateButton', { button: 'next', text: 'done', visible: true, enabled: isValid });
        }
    }

    function showStep(step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex-1];
        }

        if( initialized ) {
            if( !currentStep || currentStep.key !== step.key ) {
                connection.trigger('gotoStep', step);
            }

            currentStep = step;
        }

        $('.step').hide();

        switch(step.key) {
            case 'step1':
                $('#step1').show();
                connection.trigger('updateButton', { button: 'next', enabled: Boolean(getMessage()) });
                connection.trigger('updateButton', { button: 'back', visible: false });
                break;
            case 'step2':
                $('#step2').show();
                connection.trigger('updateButton', { button: 'back', visible: true });
                connection.trigger('updateButton', { button: 'next', text: 'next', visible: true });
                break;
            case 'step3':
                $('#step3').show();

                preparePayload();
                $('#payload').val(JSON.stringify(payload, null, 4));

                connection.trigger('updateButton', { button: 'back', visible: true });
                updateStep3NextButton(true);
                break;
            case 'step4':
                $('#step4').show();
                break;
        }
    }

    function preparePayload() {
        var name = $('#select1').find('option:selected').html();
        var value = getMessage();

        // payload is initialized on populateFields above.  Journey Builder sends an initial payload with defaults
        // set by this activity's config.json file.  Any property may be overridden as desired.
        payload.name = name;

        payload['arguments'].execute.inArguments = [{ "message": value }];

        payload['metaData'].isConfigured = true;
    }

    function save() {
        connection.trigger('updateActivity', payload);
    }

    function getMessage() {
        return $('#select1').find('option:selected').attr('value').trim();
    }
});