const assert = require('assert');

const Util = require('../src/core/util.js');
   
// *********************************************************************

describe("Test Util Object" , function () {

    it("Test .clean() " , function () {

        var actual = Util.clean("UPPERCASE slash / whitespace ");
            assert.strictEqual(actual , "uppercaseslashwhitespace");
    });

    it("Test .isString() " , function () {

        var valid = Util.isString('string');
        var notValid = Util.isString({});
        
            assert.strictEqual(valid , true);        
            assert.strictEqual(notValid , false);
    });
    
});