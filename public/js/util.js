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

          initPayload : function(payload, baseUrl) {
            payload = payload || {};
            payload.metaData = payload.metaData || {};
            payload.configurationArguments = payload.configurationArguments || {};
            payload.arguments = payload.arguments || {};
            payload.arguments.execute = payload.arguments.execute || {};

            if (!payload.metaData.uid) {
                payload.metaData.uid = this.uniqueID();
                payload.arguments.execute.url = baseUrl + "?action=execute&uid=" + payload.metaData.uid;
            } 
          },

          inIFrame : function() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
          },

          upper : function(s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
          }
    };
  });