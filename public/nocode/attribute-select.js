
window.nocode = window.nocode || {};
window.nocode.attributeSelect = function( domId, schema ) {

    this.domId = domId;
    this.parentElement = document.getElementById( domId );
    this.schema = schema;

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
        var topElement = document.createElement('ul');
        topElement.setAttribute('class', 'list-group');

        var setDefinitions = this.schema.setDefinitions;
        for (var i = 0; i < setDefinitions.length; i++) {
            var setDefinition = setDefinitions[i];
            
            var group = document.createElement('li');
            group.innerHTML = setDefinition.definitionName.value;
            topElement.appendChild(group);

            var listGroup = document.createElement('ul');
            topElement.appendChild(listGroup);

            for (var k = 0; k < setDefinition.valueDefinitions.length; k++) {
                var valueDefinition = setDefinition.valueDefinitions[k];
                
                var option = document.createElement('li');
                option.innerHTML = valueDefinition.definitionName.value;
                option.setAttribute('data-value', valueDefinition.definitionID);
                option.setAttribute('draggable', 'true');
                listGroup.appendChild(option);
            }
            
        }

        return topElement;
    }
}

