var expect = require('chai').expect;
var attributeSelect = require('../../../public/nocode/attribute-select.js')

describe('attribute-input', function() {
    it ('should be a function', function() {
        expect(attributeSelect).to.be.a('function');
    });

    describe('renderElement', function() {
        it ('should return a select element', function() {
            var selector = new attributeSelect("id", null);
        });
    });
})