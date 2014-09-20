
LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

/*global describe, beforeEach, assert, it  */
(function () {
	'use strict';
    var expect = chai.expect;
    var should = chai.should();
    var assert = chai.assert;
	
	describe('Bridge Model', function () {

		describe('Construct', function() {
			it('Should have created a new bridge with default values', function() {
				should.exist(LibertyMutualIVIBaseApp.Models.BridgeModel);
			});
			it('Should initialize the correct plugin', function() {
				should.exist(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel);
			});
			/*
			it('Should handle unknown platform types', function() {
				//setup
				LibertyMutualIVIBaseApp.Models.ContextModel.set({"platform" : 'NotAPlugin'});				
				//test
				assert.throws(LibertyMutualIVIBaseApp.Models.BridgeModel.initialize, 'Unknown platform');
				//teardown
				LibertyMutualIVIBaseApp.Models.ContextModel.set({"platform" : 'WebLink'});
				LibertyMutualIVIBaseApp.Models.BridgeModel.initialize();
			});
			*/
		});
		
		describe('Geolocation', function() {
			it('Should have defined geolocation', function() {
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.gpsTimestamp);
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.gpsAccuracy);
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.gpsAltitude);
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.gpsAltitudeAccuracy);
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.gpsHeading);
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.gpsLatitude);
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.gpsLongitude);
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.gpsSpeed);
			});
		});
		describe('GeoLocation Attributes', function() {
			it('Timestamp', function() {
				LibertyMutualIVIBaseApp.Models.BridgeModel.gpsTimestamp().should.equal('');
			});
			it('Accuracy', function() {
				LibertyMutualIVIBaseApp.Models.BridgeModel.gpsAccuracy().should.equal('');
			});
			it('Altitude', function() {
				LibertyMutualIVIBaseApp.Models.BridgeModel.gpsAltitude().should.equal('');
			});
			it('AltitudeAccuracy', function() {
				LibertyMutualIVIBaseApp.Models.BridgeModel.gpsAltitudeAccuracy().should.equal('');
			});
			it('Heading', function() {
				LibertyMutualIVIBaseApp.Models.BridgeModel.gpsHeading().should.equal('');
			});
			it('Latitude', function() {
				LibertyMutualIVIBaseApp.Models.BridgeModel.gpsLatitude().should.equal('');
			});
			it('Longitude', function() {
				LibertyMutualIVIBaseApp.Models.BridgeModel.gpsLongitude().should.equal('');
			});
			it('GPS Speed', function() {
				LibertyMutualIVIBaseApp.Models.BridgeModel.gpsSpeed().should.equal('');
			});
		});

		
		describe('Running Status', function() {
			it('Should get acceleration', function() {
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.acceleration);
				var b = LibertyMutualIVIBaseApp.Models.BridgeModel.acceleration();
				b.x.should.equal(0);
				b.y.should.equal(0);
				b.z.should.equal(0);
			});
			it('Should get speed', function() {
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.speed);
				LibertyMutualIVIBaseApp.Models.BridgeModel.speed().should.equal(0);
			});
			it('Should get trip meter', function() {
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.tripMeter);
				var meter = LibertyMutualIVIBaseApp.Models.BridgeModel.tripMeter();
				meter.averageSpeed.should.equal(0);
				meter.distance.should.equal(0);
				meter.fuelConsumption.should.equal(0);
			});
			
		});
		

		describe('Identification', function() {
			it('should have defined identification attributes', function() {		
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.vin);
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.wmi);
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.brand);
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.model);
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.vehicleType);
				assert.isDefined(LibertyMutualIVIBaseApp.Models.BridgeModel.year);
			});
			it('should get vin', function() {		
				LibertyMutualIVIBaseApp.Models.BridgeModel.vin().should.equal('');
			});
			it('should get wmi', function() {		
				LibertyMutualIVIBaseApp.Models.BridgeModel.wmi().should.equal('');
			});
			it('should get brand', function() {		
				LibertyMutualIVIBaseApp.Models.BridgeModel.brand().should.equal('');
			});
			it('should get model', function() {		
				LibertyMutualIVIBaseApp.Models.BridgeModel.model().should.equal('');
			});
			it('should get vehicleType', function() {		
				LibertyMutualIVIBaseApp.Models.BridgeModel.vehicleType().should.equal('');
			});
			it('should get year', function() {		
				LibertyMutualIVIBaseApp.Models.BridgeModel.year().should.equal(0);
			});
		});
		/*
		describe('Error', function() {
			it('Should handle errors', function() {
				var temp = window.navigator.vehicle.identification;
				window.navigator.vehicle.identification = null;
				
				assert.throws(this.Plugin.vehicleSpeedSubscribe(), 'VehicleSpeed Interface is not available');
				
				var vin = this.Bridge.get('vin');
				
				should.exist(this.Bridge.vin);
				
				window.navigator.vehicle.identification = temp;
			});
		});
		*/
	});
})();
