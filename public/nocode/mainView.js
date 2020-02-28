window.nocode = window.nocode || {};
window.nocode.mainView = function( domId, contactSchema, inArgsSchema, inArgsValues ) {

    this.domId = domId;
    this.inArgsSchema = inArgsSchema;
    this.contactSchema = contactSchema;
    this.parentElement = document.getElementById( domId );

    this.render = function() {
        var child = this.parentElement.lastElementChild;  
        while (child) { 
            this.parentElement.removeChild(child); 
            child = this.parentElement.lastElementChild; 
        }

        var hubView = new window.nocode.hubView(this.domId);
        hubView.render();

        /*
        var topDiv = document.createElement('div');
        topDiv.className = "row";

        var attributeList = document.createElement('div');
        attributeList.id = "attributeList";
        attributeList.className = "col-md-6";

        var attributeSelect = document.createElement('div');
        attributeSelect.id = "attributeSelector";
        attributeSelect.className = "col-md-6";

        topDiv.appendChild(attributeList);
        topDiv.appendChild(attributeSelect);

        document.getElementById(domId).appendChild(topDiv);
        
        var attributeList = new window.nocode.attributeList('attributeList', this.inArgsSchema);
        var attributeSelector = new window.nocode.attributeSelect('attributeSelector', this.contactSchema);
        attributeList.render();
        attributeSelector.render();
        */
    }
}