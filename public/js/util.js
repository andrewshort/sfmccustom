define([], function() {

    return {
        uniqueID : function(){
            function chr4(){
              return Math.random().toString(16).slice(-4);
            }
            return chr4() + chr4() +
              '-' + chr4() +
              '-' + chr4() +
              '-' + chr4() +
              '-' + chr4() + chr4() + chr4();
          },

          initPayload : function(payload) {
            payload = payload || {};
            payload.metaData = payload.metaData || {};
            payload.configurationArguments = payload.configurationArguments || {};
            payload.arguments = payload.arguments || {};
            payload.arguments.execute = payload.arguments.execute || {};
          },

          inIFrame : function() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
          }
    };
  });