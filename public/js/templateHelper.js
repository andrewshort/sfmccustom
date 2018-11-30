/*jshint esversion: 6 */
define([], function() {

    return {
          getConfigTemplate : function(configProp) {
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
          }
    };
  });