window.nocode = window.nocode || {};
window.nocode.mainView = function( domId, contactSchema, inArgs ) {

    this.domId = domId;
    this.inArgs = inArgs;
    this.contactSchema = contactSchema;
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

        var topDiv = document.createElement('div');

        var attributeList = document.createElement('div');
        attributeList.id = "attributeList";

        var attributeSelect = document.createElement('div');
        attributeSelect.id = "attributeSelect";

        topDiv.appendChild(attributeList);
        topDiv.appendChild(attributeSelect);

        var attributeList = new window.nocode.attributeList('attributeList', payload.schema.arguments.execute.inArguments);
        var attributeSelector = new window.nocode.attributeSelect('attributeSelector', data.schemaReponse.schema);
        attributeList.render();
        attributeSelector.render();
    }
}