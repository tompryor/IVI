/*global describe, beforeEach, assert, it  */
(function () { 
      'use strict';
      var expect = chai.expect;
      var should = chai.should();
      var assert = chai.assert;

      describe('Core Engine', function () {
              
          describe('Construct', function () {
            it('Core Engine should exist', function() {
                expect(LibertyMutualIVIBaseApp.CoreEngine).to.exist;
             });
          });
          describe('Start', function () {
        	 it('should create the context model', function () {
        		 expect(LibertyMutualIVIBaseApp.Models.ContextModel).to.exist;
        	 });
        	 it('should create the platform model', function () {
        		 expect(LibertyMutualIVIBaseApp.Models.PlatformModel).to.exist;
        	 });
        	 it('should create the bridge model', function () {
        		 expect(LibertyMutualIVIBaseApp.Models.BridgeModel).to.exist;
        	 });
        	 it('should create the device model', function () {
        		 expect(LibertyMutualIVIBaseApp.Models.DeviceModel).to.exist;
        	 });
        	 it('should create the user model', function () {
        		 expect(LibertyMutualIVIBaseApp.Models.UserModel).to.exist;
        	 });
        	 it('should start the simulator ', function () {
        		 ///???
        	 });
          });
      });
})();
