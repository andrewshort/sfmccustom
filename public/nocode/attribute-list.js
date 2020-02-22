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

        var selectElement = this.renderElement();
        document.getElementById(domId).appendChild(selectElement);
    }

    this.renderElement = function() {
        var span = document.createElement('span');
        span.innerHTML = "TODO: Attribute List";
        return span;
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