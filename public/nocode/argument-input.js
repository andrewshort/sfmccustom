(function() {

    var argumentInput = function( domId, inArgumentSchema ) {

        this.domId = domId;
        this.parentElement = document.getElementById( domId );
        this.inArgumentSchema = inArgumentSchema;

        this.render = function() {
            var divElement = document.createElement('divElement');

            var setDefinitions = this.schema.setDefinitions;
            for (var i = 0; i < setDefinitions.length; i++) {
                var setDefinition = setDefinitions[i];
                
                var group = document.createElement('optgroup');
                group.setAttribute('label', setDefinition.definitionName.value);

                for (var k = 0; k < setDefinition.valueDefinitions.length; k++) {
                    var valueDefinition = setDefinition.valueDefinitions[k];
                    
                    var option = document.createElement('option');
                    option.innerHTML = valueDefinition.definitionName.value;
                    option.setAttribute('value', valueDefinition.definitionID);
                    group.appendChild(option);
                }
                selectElement.appendChild(group);
            }

            var child = this.parentElement.lastElementChild;  
            while (child) { 
                this.parentElement.removeChild(child); 
                child = this.parentElement.lastElementChild; 
            }

            document.getElementById(domId).appendChild(selectElement);
        }
    }

    window.nocode = window.nocode || {};
    window.nocode.argumentInput = argumentInput;

})();

