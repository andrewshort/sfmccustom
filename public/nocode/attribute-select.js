
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

        var topElement = document.createElement('ul');
        topElement.setAttribute('class', 'list-group attribute-selector');
        topElement.style.height = "300px";
        topElement.style.overflow = "scroll";
        document.getElementById(domId).appendChild(topElement);

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
                //option.innerHTML = valueDefinition.definitionName.value;
                //option.setAttribute('data-value', valueDefinition.definitionID);
                //option.setAttribute('draggable', 'true');
                
                var innerDiv = document.createElement("div");
                innerDiv.setAttribute('data-value', valueDefinition.definitionID);
                innerDiv.setAttribute('data-expression', "TODO");
                // innerDiv.setAttribute('draggable', 'true');
                innerDiv.innerHTML = valueDefinition.definitionName.value;
                option.appendChild(innerDiv);

                

                listGroup.appendChild(option);
                // option.addEventListener('dragstart', this.onDragStart, false);
                option.addEventListener('click', this.onAttributeClick);

            }   
        }
    }

    this.onAttributeClick = function(e) {
        
        var attributeId = e.target.getAttribute('data-value');
        var expression = e.target.getAttribute('data-expression');

        console.log(expression);
        window.copy(expression);
    };

    this.onDragStart = function(e) {
        console.log('onDragStart');
        e.dataTransfer.setData('text/plain', e.target.dataset.value);
        return true;
    }
}

