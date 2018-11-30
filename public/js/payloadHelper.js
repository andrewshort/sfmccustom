define([], function() {

    return {
        updatePayloadFromUiObject: function(obj) {
            if (obj.include) {
                payload.configurationArguments[obj.configEndpoint] = payload.configurationArguments[obj.configEndpoint] || {};
                payload.configurationArguments[obj.configEndpoint].statusCode = obj.statusCode;
                payload.configurationArguments[obj.configEndpoint].url = baseUrl + "?action=" + obj.configEndpoint + "&uid=" + payload.metaData.uid + "&returnStatusCode=" + obj.statusCode + "&timeout=0";
    
                if (obj.body) {
                    payload.configurationArguments[obj.configEndpoint].body = obj.body;
                } else {
                    delete payload.configurationArguments[obj.configEndpoint].body;
                }
            } else {
                delete payload.configurationArguments[obj.configEndpoint];
            }
        }
    };
  });