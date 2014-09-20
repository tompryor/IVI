/*global describe, beforeEach, assert, it  */
(function () {
	'use strict';
    var expect = chai.expect;
    var should = chai.should();
    var assert = chai.assert;

	describe('Device Model', function () {
	    describe('Construct', function() {
	    	it('Should have created a new device model with default values', function() {
	    	should.exist(LibertyMutualIVIBaseApp.Models.DeviceModel);
	    		
				assert.equal(LibertyMutualIVIBaseApp.Models.DeviceModel.get('id'), '');
				assert.equal(LibertyMutualIVIBaseApp.Models.DeviceModel.get('vinNum'), '');
				assert.equal(LibertyMutualIVIBaseApp.Models.DeviceModel.get('latitude'), '');
				assert.equal(LibertyMutualIVIBaseApp.Models.DeviceModel.get('longitude'), '');

			});
		});
	});
})();