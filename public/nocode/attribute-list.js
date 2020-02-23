window.nocode = window.nocode || {};
window.nocode.attributeList = function( domId, inArgs ) {

    this.domId = domId;
    this.inArgs = inArgs;
    this.parentElement = document.getElementById( domId );

    this.render = function() {
        var child = this.parentElement.lastElementChild;  
        while (child) { 
            this.parentElement.removeChild(child); 
            child = this.parentElement.lastElementChild; 
        }

        var topDiv = document.createElement("div");
        document.getElementById(domId).appendChild(topDiv);
        
        var inArgs = this.inArgs;
        for (var i = 0; i < inArgs.length; i++) {
            var inArg = inArgs[i];
            Object.keys(inArg).forEach(function(key,index) {
                var schemaObject = inArg[key];
                var dataType = schemaObject.dataType || "Text";
                var isNullable = schemaObject.isNullable || true;
                // var direction = schemaObject.direction || "in";

                var label = document.createElement("label");
                label.innerHTML = key;
                if (!isNullable) {
                    label = label + " *";
                }

                var input = document.createElement("input");
                input.className = "form-control";
                input.placeholder = dataType;

                var div = document.createElement("div");
                div.className = "form-group";
                div.appendChild(label);
                div.appendChild(input);
                topDiv.appendChild(div);

                input.addEventListener('dragover', this.onDragOver);
                input.addEventListener('drop', this.onDrop);
            });
        }
        
    }

    this.onDragOver = function(e) {
        e.preventDefault();
        console.log('onDragOver');
        console.log(e);
    }

    this.onDrop = function(e) {
        console.log('onDrop');
        console.log(e);
    }

    /*
[
                {
                    "exampleInArgumentText":
                    {
                        "dataType": "Text",
                        "isNullable": false,
                        "direction": "in"
                    }
                },
                {
                    "exampleInArgumentNumber":
                    {
                        "dataType": "Number",
                        "isNullable": false,
                        "direction": "in"
                    }
                },
                {
                    "exampleInArgumentTextRequired":
                    {
                        "dataType": "Number",
                        "isNullable": false,
                        "direction": "in"
                    }
                }]
    */
}