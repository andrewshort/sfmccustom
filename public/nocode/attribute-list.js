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
            var onDragOver = this.onDragOver;
            var onDrop = this.onDrop;
            var onDragEnter = this.onDragEnter;
            var onDragLeave = this.onDragLeave;

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

                //div.ondragover = onDragOver;
                //div.ondragenter = onDragEnter;
                //div.ondrop = onDrop;
                input.addEventListener('dragover', onDragOver, false);
                input.addEventListener('dragenter', onDragEnter, false);
                input.addEventListener('drop', onDrop, false);
                input.addEventListener('dragleave', onDragLeave, false);
            });
        }
        
    }

    this.onDragEnter = function(e) {
        e.preventDefault();
        console.log('onDragEnter');
        console.log(e);
        
        
        return false;
    }

    this.onDragLeave = function(e) {
        e.preventDefault();
        console.log('onDragLeave');
        console.log(e);
        
        
        return false;
    }

    this.onDragOver = function(e) {
        e.preventDefault();        
        console.log('onDragOver');
        console.log(e);
        
        
    }

    this.onDrop = function(e) {
        e.preventDefault();
        console.log('onDrop');
        console.log(e);
        return false;
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