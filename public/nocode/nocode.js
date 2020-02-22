/*jshint esversion: 6 */
define([
    '../js/postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    
    function initialize(data) {
        if (data) {
            payload = data;
        }

        updateButton('next', 'Done', true);
        updateButton('back', 'Back', false);

        connection.trigger('requestContactsSchema');
    }    

    function onClickedNext() {     
        payload.metaData.isConfigured = true;
        connection.trigger('updateActivity', payload);  
    }

    function updateButton(button, text, visible) {
        connection.trigger('updateButton', {
            button: button,
            visible: visible,
            text: text
        });
    }

    function onRequestedContactsSchema( data ) {
        var attributeList = new window.nocode.attributeSelect('attributeList', payload.schema.arguments.execute.inArguments);
        var attributeSelector = new window.nocode.attributeSelect('attributeSelector', data.schemaReponse.schema);
        attributeList.render();
        attributeSelector.render();
    }

    $(window).ready(function() {
        connection.trigger('ready'); // JB will respond the first time 'ready' is called with 'initActivity'
    });

    connection.on('initActivity', initialize);
    connection.on('clickedNext', onClickedNext);
    connection.on('requestedContactsSchema', onRequestedContactsSchema);
});