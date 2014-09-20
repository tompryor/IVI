

(function() {
	'use strict';

    var expect = chai.expect;
    var should = chai.should();
    var assert = chai.assert;

    
	describe('Weblink Plugin', function() {

		
		//WebLink Array Simulator Setup
		describe('WebLink Array Simulator Setup', function () {
			ns_vehicleinfo._startSimulation ();
			
			var simData =
				[["No","Latitude","Longitude","Altitude","vehicleSpeed_speed","Heading","Time"],
				 ["1","32.905155","-117.178937","124.7","0.25928","272.4","1408739316301"]];
			
			ns_vehicleinfo._startFileSimulation ( simData, 1000, true);
			
			ns_vehicleinfo._stopFileSimulation ();
		});
		
		
		describe('Construct', function() {
			it('should create a new plugin', function() {
				should.exist(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel);
			});
			
		});
		
		describe('GeoLocation', function() {
			this.timeout(15000);
			before(function(done) {
				LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationPoll();
				setTimeout(function(){done();}, 1000);
			});
			
			it('should be an object', function(done) {
				//Setup
				setTimeout(1500);
				
				//Test
				LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationPoll();
				should.exist(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('geolocation'));
				
				//Tear Down
				done();
			});
			
			describe('polling should get each gps attribute and be accurate based on sim data', function() {
				before(function(){

				});
				//Tests are kinda BS for now, need dynamic loading with the array simulator
				it('gpsTimestamp', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsTimestamp').should.not.equal('');
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsTimestamp').should.equal('0');
	            	done();
				});
				it('gpsAccuracy', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsAccuracy').should.not.equal('');
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsAccuracy').should.equal(10);
	            	done();
				});
				it('gpsLatitude', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsLatitude').should.not.equal('');
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsAccuracy').should.equal(10);
	            	done();
				});
				it('gpsTimestamp', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsTimestamp').should.not.equal('');
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsAccuracy').should.equal(10);
	            	done();
				});
				it('gpsLongitude', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsLongitude').should.not.equal('');
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsAccuracy').should.equal(10);
	            	done();
				});
				it('gpsAltitude', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsAltitude').should.not.equal('');
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsAltitude').should.equal(0);
	            	done();
				});
				it('gpsAltitudeAccuracy', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsAltitudeAccuracy').should.not.equal('');
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsAltitudeAccuracy').should.equal(10);
	            	done();
				});
				it('gpsHeading', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsHeading').should.not.equal('');
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsHeading').should.equal(0);
	            	done();
				});
				it('gpsSpeed', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsSpeed').should.not.equal('');
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsSpeed').should.equal(0);
	            	done();
				});
			});
			
			

			/* window.navigator.geolocation can never be null
			it('polling should throw an error if gelocation interface does not exist', function() {
				var temp = window.navigator.geolocation;
				window.navigator.geolocation = null;
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationSubscribe, 'Geolocation Interface does not exist');
				window.navigator.geolocation = temp;
				console.log('end polling error check 1');
			});
			*/
			
			
			describe('subscriber should watch and get each gps attribute', function() {
				before(function(){
					//setup
					setTimeout(15000);
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationSubscribe();
				});
				it('gpsTimestamp', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsTimestamp').should.not.equal('');
	            	done();
				});
				it('gpsAccuracy', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsAccuracy').should.not.equal('');
	            	done();
				});
				it('gpsLatitude', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsLatitude').should.not.equal('');
	            	done();
				});
				it('gpsTimestamp', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsTimestamp').should.not.equal('');
	            	done();
				});
				it('gpsLongitude', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsLongitude').should.not.equal('');
	            	done();
				});
				/*
				it('gpsAltitude', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsAltitude').should.not.equal('');
	            	done();
				});
				it('gpsAltitudeAccuracy', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsAltitudeAccuracy').should.not.equal('');
	            	done();
				});
				it('gpsHeading', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsHeading').should.not.equal('');
	            	done();
				});
				it('gpsSpeed', function(done) {
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('gpsSpeed').should.not.equal('');
	            	done();
				});
				*/
				after(function(){
					//teardown
	            	LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationUnSubscribe();
				});
			});
			
			/* window.navigator.geolocation can never be null
			it('subscriber should throw an error if gelocation interface does not exist', function() {
				var temp = window.navigator.geolocation;
				window.navigator.geolocation = null;
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationSubscribe, 'Geolocation Interface is not available');
				window.navigator.geolocation = temp;
				console.log('end subscribe error check 1');
			});
			*/
		});
		
	
		describe('Acceleration', function() {
			it('should be an object', function() {
				LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('acceleration').should.be.a('object');
			});
			it('should subscribe and get each acceleration axis', function() {
				var accel = LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('acceleration');
				accel.x.should.equal(0);
				accel.y.should.equal(0);
				accel.z.should.equal(0);
			});
			it('should throw an error if window.navigator.vehicle does not exist', function() {
				var temp = window.navigator.vehicle;
				window.navigator.vehicle = null;
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.accelerationSubscribe, 'Vehicle Interface does not exist');
				window.navigator.vehicle = temp;
			});
			it('should throw an error if Acceleration interface is not available', function(){
				window.navigator.vehicle.acceleration._setAvailable("not available");
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.accelerationSubscribe, 'acceleration Interface is not available');
				window.navigator.vehicle.acceleration._setAvailable("available");
			});
		});
				
		describe('Trip Meter', function() {
			it('should be an object', function() {
				LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('tripMeter').should.be.a('object');
			});
			it('should subscribe and get each trip meter attribute', function() {
				
				//checks default attribute values
				var meter = LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('tripMeter');
				meter.averageSpeed.should.equal(0);
				meter.distance.should.equal(0);
				meter.fuelConsumption.should.equal(0);
			});
			it('should throw an error if window.navigator.vehicle does not exist', function() {
				//sets vehicle object to null and checks to see if correct error is thrown
				var temp = window.navigator.vehicle;
				window.navigator.vehicle = null;
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.tripMeterSubscribe, 'Vehicle Interface does not exist');
				window.navigator.vehicle = temp;
			});
			it('should throw an error if Trip Meter interface is not available', function(){
				//sets attribute availability to anything other than "available" and checks if correct error throws
				window.navigator.vehicle.tripMeter._setAvailable("not available");
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.tripMeterSubscribe, 'tripMeter Interface is not available');
				window.navigator.vehicle.tripMeter._setAvailable("available");
			});
		});
		
		describe('Vehicle Speed', function() {
			it('should have a speed attribute', function() {					
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('speed'), 0);
			});
			it('should be able to subscribe to speed events', function() {
				
				//checks default attribute values
				var temp = window.navigator.vehicle.vehicleSpeed.speed;	
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('speed'), 0);
				window.navigator.vehicle.vehicleSpeed.speed = temp;
			});
			it('should throw an error if window.navigator.vehicle does not exist', function() {
				//sets vehicle object to null and checks to see if correct error is thrown
				var temp = window.navigator.vehicle;
				window.navigator.vehicle = null;
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vehicleSpeedSubscribe, 'Vehicle Interface does not exist');
				window.navigator.vehicle = temp;
			});
			it('should throw an error if VehicleSpeed interface is not available', function(){
				//sets attribute availability to anything other than "available" and checks if correct error throws
				window.navigator.vehicle.vehicleSpeed._setAvailable("not available");
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vehicleSpeedSubscribe, 'VehicleSpeed Interface is not available');
				window.navigator.vehicle.vehicleSpeed._setAvailable("available");
			});
		});
		
		
		describe('Vehicle VIN', function() {
			it('should have a vin attribute', function() {	
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('vin'), '');
			});
			it('should update vin attribute when window object changes', function() {
				//Setup
				var temp = window.navigator.vehicle.identification.VIN;
				window.navigator.vehicle.identification.VIN = 1234;
				
				//Test
				LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vinPoll();
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('vin'), '1234');
				
				//Tear Down
				window.navigator.vehicle.identification.VIN = temp;
			});
			it('should throw an error if window.navigator.vehicle does not exist', function() {
				
				//sets vehicle object to null and checks to see if correct error is thrown
				var temp = window.navigator.vehicle;
				window.navigator.vehicle = null;
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vinPoll, 'Vehicle Interface is not available');
				window.navigator.vehicle = temp;
			});
			it('should throw an error if Vehicle Identification interface is not available', function(){
				//sets attribute availability to anything other than "available" and checks if correct error throws
				window.navigator.vehicle.identification._setAvailable("not available");
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vinPoll, 'Vehicle Identification Interface is not available');
				window.navigator.vehicle.identification._setAvailable("available");
			});
		});	
		
		describe('Vehicle WMI', function() {
			it('should have wmi attribute', function() {	
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('wmi'), '');
			});
			it('should update wmi attribute when window object changes', function(){
				//Setup
				var temp = window.navigator.vehicle.identification.WMI;
				window.navigator.vehicle.identification.WMI = '4321';
				
				//Test
				LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.wmiPoll();
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('wmi'), '4321');
				
				//Tear Down
				window.navigator.vehicle.identification.WMI = temp;
			});
			it('should throw an error if window.navigator.vehicle does not exist', function() {
				
				//sets vehicle object to null and checks to see if correct error is thrown
				var temp = window.navigator.vehicle;
				window.navigator.vehicle = null;
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.wmiPoll, 'Vehicle Interface is not available');
				window.navigator.vehicle = temp;

			});
			it('should throw an error if Vehicle Identification interface is not available', function(){
				//sets attribute availability to anything other than "available" and checks if correct error throws
				window.navigator.vehicle.identification._setAvailable("not available");
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.wmiPoll, 'Vehicle Identification Interface is not available');
				window.navigator.vehicle.identification._setAvailable("available");
			});
			
		});	
		
		describe('Vehicle Brand', function() {
			it('should have a brand attribute', function() {	
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('brand'), '');
			});
			it('should update brand attribute when window object changes', function(){
				//Setup
				var temp = window.navigator.vehicle.identification.brand;
				window.navigator.vehicle.identification.brand = 'Ford';
				
				//Test
				LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.brandPoll();
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('brand'), 'Ford');
				
				//Tear Down
				window.navigator.vehicle.identification.brand = temp;
			});
			it('should throw an error if window.navigator.vehicle does not exist', function() {
				//sets vehicle object to null and checks to see if correct error is thrown
				var temp = window.navigator.vehicle;
				window.navigator.vehicle = null;
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.brandPoll, 'Vehicle Interface is not available');
				window.navigator.vehicle = temp;

			});
			it('should throw an error if Vehicle Identification interface is not available', function(){
				//sets attribute availability to anything other than "available" and checks if correct error throws
				window.navigator.vehicle.identification._setAvailable("not available");
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.brandPoll, 'Vehicle Identification Interface is not available');
				window.navigator.vehicle.identification._setAvailable("available");
			});
			
		});	
		describe('Vehicle Model', function() {
			it('should have a model attribute', function() {	
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('model'), '');
			});
			it('should update vehicle model attribute when window object changes', function(){
				//Setup
				var temp = window.navigator.vehicle.identification.model;
				window.navigator.vehicle.identification.model = 'Fiesta';
				
				//Test
				LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.modelPoll();
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('model'), 'Fiesta');
				
				//Tear Down
				window.navigator.vehicle.identification.model = temp;
			});
			it('should throw an error if window.navigator.vehicle does not exist', function() {
				//sets vehicle object to null and checks to see if correct error is thrown
				var temp = window.navigator.vehicle;
				window.navigator.vehicle = null;
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.modelPoll, 'Vehicle Interface is not available');
				window.navigator.vehicle = temp;

			});
			it('should throw an error if Vehicle Identification interface is not available', function(){
				//sets attribute availability to anything other than "available" and checks if correct error throws
				window.navigator.vehicle.identification._setAvailable("not available");
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.modelPoll, 'Vehicle Identification Interface is not available');
				window.navigator.vehicle.identification._setAvailable("available");
			});
			
		});	
		
		
		describe('Vehicle Type', function() {
			it('should have a vehicleType attribute', function() {	
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('vehicleType'), '');
			});
			it('should update vehicle type attribute when window object changes', function(){
				//Setup
				var temp = window.navigator.vehicle.identification.vehicleType;
				window.navigator.vehicle.identification.vehicleType = 'Truck';
				
				//Test
				LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vehicleTypePoll();
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('vehicleType'), 'Truck');
				
				//Tear Down
				window.navigator.vehicle.identification.vehicleType = temp;
			});
			it('should throw an error if window.navigator.vehicle does not exist', function() {
				//sets vehicle object to null and checks to see if correct error is thrown
				var temp = window.navigator.vehicle;
				window.navigator.vehicle = null;
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vehicleTypePoll, 'Vehicle Interface is not available');
				window.navigator.vehicle = temp;

			});
			it('should throw an error if Vehicle Identification interface is not available', function(){
				//sets attribute availability to anything other than "available" and checks if correct error throws
				window.navigator.vehicle.identification._setAvailable("not available");
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vehicleTypePoll, 'Vehicle Identification Interface is not available');
				window.navigator.vehicle.identification._setAvailable("available");
			});
			
		});	
		
		
		describe('Vehicle Year', function() {
			it('should have a year attribute', function() {	
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('year'), 0);
			});
			it('should update vehicle year attribute when window object changes', function(){
				//Setup
				var temp = window.navigator.vehicle.identification.year;
				window.navigator.vehicle.identification.year = 2014;
				
				//Test
				LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.yearPoll();
				assert.equal(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get('year'), 2014);
				
				//Tear Down
				window.navigator.vehicle.identification.year = temp;
			});
			it('should throw an error if window.navigator.vehicle does not exist', function() {
				//sets vehicle object to null and checks to see if correct error is thrown
				var temp = window.navigator.vehicle;
				window.navigator.vehicle = null;
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.yearPoll, 'Vehicle Interface is not available');
				window.navigator.vehicle = temp;

			});
			it('should throw an error if Vehicle Identification interface is not available', function(){
				//sets attribute availability to anything other than "available" and checks if correct error throws
				window.navigator.vehicle.identification._setAvailable("not available");
				assert.throws(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.yearPoll, 'Vehicle Identification Interface is not available');
				window.navigator.vehicle.identification._setAvailable("available");
			});
			
		});	

	});

})();