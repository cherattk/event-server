const assert = require('assert');

const Util = require('../../src/core/util');

// *********************************************************************

describe("Util", function () {

  it("Test .clean() ", function () {
    var actual = Util.clean("   UPPERCASE    whitespace ");
    assert.strictEqual(actual, "uppercase-whitespace");
  });

  it("Test .isString() ", function () {

    var valid = Util.isString('string');
    var notValid = Util.isString({});

    assert.strictEqual(valid, true);
    assert.strictEqual(notValid, false);
  });

});