
module.exports = function( domId, schema ) {

    this.domId = domId;
    this.parentElement = document.getElementById( domId );
    this.schema = schema;

    this.render = function() {
        var child = this.parentElement.lastElementChild;  
        while (child) { 
            this.parentElement.removeChild(child); 
            child = this.parentElement.lastElementChild; 
        }

        document.getElementById(domId).appendChild(selectElement);
    }

    this.renderElement = function() {
        var selectElement = document.createElement('select');
        selectElement.setAttribute('class', 'form-control');

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

        return selectElement;
    }
}

