/*global describe, beforeEach, assert, it  */
/**
 * 
 */
(function () {
    'use strict';
    var expect = chai.expect;
    var should = chai.should();
    var assert = chai.assert;

	describe('Platform Model', function () {
	
	    beforeEach(function () {
	        //this.Platform = new LibertyMutualIVIBaseApp.Models.PlatformModel();
	    });
	        
	    describe('Construct', function () {
	
	    	it('Should create a new Platform Model with default values', function() {
	    		
	    		//Creation of platform model
	    		expect(LibertyMutualIVIBaseApp.Models.PlatformModel).to.exist;
	    		
	    		//Creation of default values
	    		expect(LibertyMutualIVIBaseApp.Models.PlatformModel.get('platformID')).to.equal('');
	    		expect(LibertyMutualIVIBaseApp.Models.PlatformModel.get('oemName')).to.equal('');
	    		expect(LibertyMutualIVIBaseApp.Models.PlatformModel.get('hardwareVersion')).to.equal('');
	    		expect(LibertyMutualIVIBaseApp.Models.PlatformModel.get('softwareVersion')).to.equal('');
	    		expect(LibertyMutualIVIBaseApp.Models.PlatformModel.get('embedded')).to.equal('');
	    		  
	    	});
	    });  
	});
})();
