/*jshint esversion: 6 */
define(['js/util'], function(Util) {

    return {
          getConfigTemplate : function(configProp) {
            var configPropLabel = Util.upper(configProp);
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
          },

          updateTemplate : function(payload, configEndpoint) {

            if (!payload.configurationArguments[configEndpoint]) {
                return;
            }

            $("#include" + Util.upper(configEndpoint)).attr('checked', 'checked');
            $("#" + configEndpoint + "StatusCode").removeAttr('disabled');
            $("#" + configEndpoint + "StatusCode").val(payload.configurationArguments[configEndpoint].statusCode);
            $("#" + configEndpoint + "ResponseBody").val(payload.configurationArguments[configEndpoint].body);
          },

          configUpdate: function(endpoint, callback) {
            var eventFunction;
              (function(configEndpoint, callback) {
                 eventFunction = function() {
                    var includeDomId = "include" + Util.upper(configEndpoint);
                    var statusCodeDomId = configEndpoint + "StatusCode";
                    var responseBodyDomId = configEndpoint + "ResponseBody";
                
                    if ($("#" + includeDomId).is(":checked")) {
                        $("#" + statusCodeDomId).removeAttr('disabled');
                        $("#" + responseBodyDomId).removeAttr('disabled');
            
                        var statusCode = $("#" + statusCodeDomId).val();
                        var responseBody = $("#" + responseBodyDomId).val();

                        if (callback) {
                            callback({
                                configEndpoint: configEndpoint,
                                statusCode: statusCode,
                                body: responseBody,
                                include: true
                            });
                        }
                    } else {
                        $("#" + statusCodeDomId).attr('disabled', 'disabled');
                        $("#" + responseBodyDomId).attr('disabled', 'disabled');
            
                        if (callback) {
                            callback({
                                configEndpoint: configEndpoint,
                                include: false
                            });
                        }
                    }   
                };
              })(endpoint, callback);

              return eventFunction;
          }
    };
  });