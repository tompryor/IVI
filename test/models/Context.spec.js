/*global describe, beforeEach, assert, it  */
(function () {
	'use strict';
    var expect = chai.expect;
    var should = chai.should();
    var assert = chai.assert;

    describe('Context Model', function () {
	
	    beforeEach(function () {
	        //this.Context = new LibertyMutualIVIBaseApp.Models.ContextModel();
	    });

		describe('Construct', function() {
			it('Should have created a new context', function() {
				should.exist(LibertyMutualIVIBaseApp.Models.ContextModel);
				assert.equal(LibertyMutualIVIBaseApp.Models.ContextModel.get('platform'), 'WebLink');
			});
		});
	});
})();
