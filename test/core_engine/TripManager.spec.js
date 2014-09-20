/*global describe, beforeEach, assert, it  */
'use strict';

describe('Core Engine - Trip Manager', function () {

		var sandbox;
		var fakeErrorHandler;
		var fakeUser;
		var fakeBridge;
		var tripManager;
		
    	beforeEach(function() {	
			sandbox = sinon.sandbox.create();
			sandbox.useFakeServer();
			fakeErrorHandler = { onTripCreationError: function (response) {} };
    		sandbox.spy(fakeErrorHandler, "onTripCreationError");
    		fakeUser = { get: function (userAttribute) {} };
    		sandbox.stub(fakeUser, "get");
    		fakeUser.get.withArgs("id").returns(123456);
    		fakeUser.get.withArgs("trackingSetAutomatically").returns(false);
    		fakeBridge = { gpsSpeed: function () {} };
    		sandbox.stub(fakeBridge, "gpsSpeed");
    		fakeBridge.gpsSpeed.returns(0);
		});
		
		afterEach(function() {
			sandbox.restore();
		});
		
		// Tracking Manually 
		
		describe('Manual tracking', function() {
			beforeEach(function() {
				tripManager = new LibertyMutualIVIBaseApp.CoreEngine.TripManager(fakeErrorHandler, fakeUser, fakeBridge);	
			});
		
	        describe('Construct', function () {
	        	it('Trip Manager should exist', function() {
	        		expect(tripManager).to.exist;
	             });
	        });
	        
	        describe('Create New Trip', function () {
	        	it('Should set current trip on success', function() {
	        		sandbox.server.respondWith("POST", "http://localhost:9081/ivi/resources/trips?userID=123456",
	                        [201, { "Content-Type": "application/json" },
	                         '{ "id": "e123r23ur89348914"}']);
	        		tripManager.newTrip();
	        		expect(tripManager.currentTrip).to.equal(null);
	        		sandbox.server.respond();
	        		expect(tripManager.currentTrip).to.not.equal(null);
	        		
	        	 });
	        	
	        	it('Should set current trip on success and check trip ID', function() {
	        		sandbox.server.respondWith("POST", "http://localhost:9081/ivi/resources/trips?userID=123456",
	                        [201, { "Content-Type": "application/json" },
	                         '{ "id": "e123r23ur89348914"}']);
	        		tripManager.newTrip();
	        		expect(tripManager.currentTrip).to.equal(null);
	        		sandbox.server.respond();
	        		expect(tripManager.currentTrip.id).to.equal('e123r23ur89348914');
	        		
	        	 });
	        });
	        
	        describe('Fail to create New Trip', function () {
	
	        	it('Should not set current trip on error', function() {
	        		sandbox.server.respondWith("POST", "http://localhost:9081/ivi/resources/trips?userID=123456",
	        				[404, {}, ""]);
	        		tripManager.newTrip();
	        		expect(tripManager.currentTrip).to.equal(null);
	        		sandbox.server.respond();
	        		expect(tripManager.currentTrip).to.equal(null);
	        	 });
	        });  
	        
	        describe('Error Handling', function () {
	
	        	it('Should call Error Handling module on error', function() {
	        		sandbox.server.respondWith("POST", "http://localhost:9081/ivi/resources/trips?userID=123456",
	        				[404, {}, ""]);
	        		tripManager.newTrip();
	        		expect(fakeErrorHandler.onTripCreationError.calledOnce).to.equal(false);
	        		sandbox.server.respond();
	        		expect(fakeErrorHandler.onTripCreationError.calledOnce).to.equal(true);
	        	 });
	        });
	        
	        describe('Create a second trip while first one is running', function () {
	
	        	it('Should not create a second trip', function() {
	        		tripManager.newTrip();
	        		tripManager.newTrip();
	        		expect(sandbox.server.requests.length).to.equal(1);
	        	 });
	        });
	        
	        describe('Create a second trip after first one is created', function () {
	        	
	        	it('Should not create the second trip while the first is still in progress', function() {
	        		sandbox.server.respondWith("POST", "http://localhost:9081/ivi/resources/trips?userID=123456",
	                        [201, { "Content-Type": "application/json" },
	                         '{ "id": "e123r23ur89348914"}']);
	        		tripManager.newTrip();
	        		expect(tripManager.currentTrip).to.equal(null);
	        		sandbox.server.respond();
	        		expect(tripManager.currentTrip).to.not.equal(null);
	        		expect(tripManager._runningNewTrip).to.equal(false);
	        		tripManager.newTrip();
	        		expect(tripManager._runningNewTrip).to.equal(false);
	        	});
	        	
	        	it('Should create the second trip after the first one finishes', function() {
	        		sandbox.server.respondWith("POST", "http://localhost:9081/ivi/resources/trips?userID=123456",
	                        [201, { "Content-Type": "application/json" },
	                         '{ "id": "e123r23ur89348914"}']);
	        		tripManager.newTrip();
	        		expect(tripManager.currentTrip).to.equal(null);
	        		sandbox.server.respond();
	        		expect(tripManager.currentTrip).to.not.equal(null);
	        		expect(tripManager.currentTrip.id).to.equal('e123r23ur89348914');
	        		tripManager.endTrip();
	        		expect(tripManager.currentTrip).to.equal(null);
	        		sandbox.server.respondWith("POST", "http://localhost:9081/ivi/resources/trips?userID=123456",
	                        [201, { "Content-Type": "application/json" },
	                         '{ "id": "a1a1a1a1a1a1a1a1a"}']);
	        		tripManager.newTrip();
	        		sandbox.server.respond();
	        		expect(tripManager.currentTrip).to.not.equal(null);
	        		expect(tripManager.currentTrip.id).to.equal('a1a1a1a1a1a1a1a1a');
	        	});
	        });
		});
        
        // Tracking Set Automatically Tests
        
        describe('Automatic Tracking', function () {
        	it('Should not track automatically if vehicle not in motion', function() {
        		fakeUser.get.withArgs("trackingSetAutomatically").returns(true);
				tripManager = new LibertyMutualIVIBaseApp.CoreEngine.TripManager(fakeErrorHandler, fakeUser, fakeBridge);
        		expect(tripManager._runningNewTrip).to.equal(false);
        	});
        	
        	it('Should track automatically if vehicle is in motion', function() {
        		fakeUser.get.withArgs("trackingSetAutomatically").returns(true);
        		fakeBridge.gpsSpeed.returns(1);
				tripManager = new LibertyMutualIVIBaseApp.CoreEngine.TripManager(fakeErrorHandler, fakeUser, fakeBridge);
        		expect(tripManager._runningNewTrip).to.equal(true);
        	});
        	
        	it('Should not track if vehicle is in motion but automatic tracking is disabled', function() {
        		fakeBridge.gpsSpeed.returns(1);
				tripManager = new LibertyMutualIVIBaseApp.CoreEngine.TripManager(fakeErrorHandler, fakeUser, fakeBridge);
        		expect(tripManager._runningNewTrip).to.equal(false);
        	});
        });

        
});
        

