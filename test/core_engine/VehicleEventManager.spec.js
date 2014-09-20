/*global describe, beforeEach, assert, it  */
(function () { 
      'use strict';

      describe('Core Engine - Vehicle Event Manager', function () {
              
          describe('Construct', function () {
            it('Vehicle Event Manager should exist', function() {
                expect(LibertyMutualIVIBaseApp.CoreEngine.VehicleEventManager).to.exist;
             });
          });
          /*
          describe('Start', function () {
        	 it('should create the context model', function () {
        		 expect(LibertyMutualIVIBaseApp.Models.ContextModel).to.exist;
        	 });

          });
          */
          describe('Gps Queue', function () {
        	 var gpsQueue = LibertyMutualIVIBaseApp.CoreEngine.VehicleEventManager.getQueue();
        	  
         	 it('should have a gps queue', function () {
         		 expect(gpsQueue).to.exist;
         	 });
         	 
         	 it('should be empty on start', function () {
         		 expect(gpsQueue.length).to.equal(0);
         	 });

           });
          
          describe('Gps Event Polling', function () {
         	
         	var gpsEvent = null;

         	it('should have one element in gpsQueue when called once', function () {
         		LibertyMutualIVIBaseApp.CoreEngine.VehicleEventManager.pollGps();
         		expect(LibertyMutualIVIBaseApp.CoreEngine.VehicleEventManager.getQueue().length).to.equal(1);
         	});
         	
         	it('should have created a gpsEvent when called once', function () {
         		gpsEvent = LibertyMutualIVIBaseApp.CoreEngine.VehicleEventManager.getQueue().pop();
         		expect(gpsEvent).to.exist;
         	});
         	
         	it('should have a gpsEvent with correct timestamp from the bridge', function () {
         		expect(gpsEvent.get('timestamp')).to.equal(LibertyMutualIVIBaseApp.Models.BridgeModel.gpsTimestamp());
         	});
         	
         	it('should have a gpsEvent with correct latitude from the bridge', function () {
         		expect(gpsEvent.get('latitude')).to.equal(LibertyMutualIVIBaseApp.Models.BridgeModel.gpsLatitude());
         	});
         	
         	it('should have a gpsEvent with correct longitude from the bridge', function () {
         		expect(gpsEvent.get('longitude')).to.equal(LibertyMutualIVIBaseApp.Models.BridgeModel.gpsLongitude());
         	});

          });
      });
})();
