window.nocode = window.nocode || {};
window.nocode.hubView = function( domId, contactModelSchema, inArgsSchema, inArgsValues ) {
    this.domId = domId;
    this.inArgsSchema = inArgsSchema;
    this.inArgsValues = inArgsValues;

    this.parentElement = document.getElementById( domId );

    this.render = function() {

        Object.keys(inArgsSchema).forEach(function(key,index) {
            
            
            var schemaObject = inArgsSchema[key];
            var dataType = schemaObject.dataType || "Text";
            var isNullable = schemaObject.isNullable || true;
            // var direction = schemaObject.direction || "in";

            var label = document.createElement("label");
            label.innerHTML = key;
            if (!isNullable) {
                label = label + " *";
            }

            var valueSpan = document.createElement("span");
            valueSpan.innerHTML = 'not yet defined'
            valueSpan.className = 'text-danger';

            var div = document.createElement("div");
            div.className = "row";
            div.appendChild(label);
            div.appendChild(valueSpan);
            document.getElementById(domId).appendChild(div);
        });
    }
}