/*global describe, beforeEach, assert, it  */
'use strict';

describe('Core Engine - Trip Event Manager', function () {

		var collection;
		var eventManage;
		var conHand;
		var sandbox;
		var clock;

		beforeEach(function() {
			// Create a Sinon sandbox with fake timers that replace window.setTimeout.
			// This lets us test what happens when exact amounts of time pass.
			// Tests make time pass by calling clock.tick.
			sandbox = sinon.sandbox.create();
			clock = sandbox.useFakeTimers();
			// Create a fresh TripEventManager and its related objects for each test.
			// This prevents different tests from interfering.
			collection = new LibertyMutualIVIBaseApp.Collections.TripEventCollection;
			conHand = new LibertyMutualIVIBaseApp.CoreEngine.TripManager.ConnectionHandler(collection);
			eventManage = new LibertyMutualIVIBaseApp.CoreEngine.TripManager.TripEventManager(collection, conHand);
			var httpRequest;
			if (window.XMLHttpRequest) { // Mozilla, Safari, ...
			    httpRequest = new XMLHttpRequest();
			} else if (window.ActiveXObject) { // IE 8 and older
			    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} 
			
			httpRequest.open("GET","/ivi/resources/trips/info",false);
			httpRequest.send();
			console.log('xmlhttp.responseText: ', httpRequest.responseText);
		});
		
		afterEach(function() {
			sandbox.restore();
		});
		
        describe('Construct', function () {
          it('Trip Event Manager should exist', function() {
              expect(eventManage).to.exist;
           });
        });
        /*
        describe('Start', function () {
      	 it('should create the context model', function () {
      		 expect(LibertyMutualIVIBaseApp.Models.ContextModel).to.exist;
      	 });

        });
        */
        describe('Flush threshold', function () {
        	it('should not flush on the 1st event', function () {
		   		eventManage.addNewEvent({});
		   		expect(conHand._runningFlush).to.equal(false);
	   		});
       	 
       	 it('should not flush after 20 events', function () {
       		 for (var i = 0; i < 20; i++) {
       			eventManage.addNewEvent({});
       		 }
       		 expect(conHand._runningFlush).to.equal(false);
       	 });
       	 
       	 it('should flush on the 21st event', function () {
       		 for (var i = 0; i < 21; i++) {
       			// Not flushing yet.
       			expect(conHand._runningFlush).to.equal(false);
    			eventManage.addNewEvent({});
    		 }
       		 // Now we're flushing.
       		expect(conHand._runningFlush).to.equal(true);
       	 });
       	 
       	 it('should flush 10 seconds after a single event', function () {
       		 // Add just one event to the manager.
       		 eventManage.addNewEvent({});
       		 // It should not immediately flush.
      		 expect(conHand._runningFlush).to.equal(false);
      		 // After 9.999 seconds it should still not flush.
      		 clock.tick(9999);
      		 expect(conHand._runningFlush).to.equal(false);
      		 // But after a total of 10 seconds, it should flush.
      		 clock.tick(1);
      		 expect(conHand._runningFlush).to.equal(true);
       	 });
       	 
       	 it('should flush 10 seconds after the first event in a slow sequence', function () {
       		 // Add one event to the manager every second for 9 seconds.
       		 // It should not flush yet.
       		 for (var i = 0; i < 9; i++) {
	       		 eventManage.addNewEvent({});
	       		 expect(conHand._runningFlush).to.equal(false);
	       		 clock.tick(1000);
	       		 expect(conHand._runningFlush).to.equal(false);
       	 	 }
       	 	 // After one more event and one more second, it should flush.
       	 	 eventManage.addNewEvent({});
       	 	 expect(conHand._runningFlush).to.equal(false);
       	 	 clock.tick(1000);
       	 	 expect(conHand._runningFlush).to.equal(true);
       	 });
       	 /*
       	 it('should reset timer after flush', function () {
       		// Add one event.
       		eventManage.addNewEvent({});
       		// Should not be flushing. 
       		expect(conHand._runningFlush).to.equal(false);
       		// Now 9 seconds pass and then we get 19 events. Should start flushing on the last one.
       		clock.tick(9000);
      		 for (var i = 0; i < 19; i++) {
        		expect(conHand._runningFlush).to.equal(false);
	       		 eventManage.addNewEvent({});
       	 	 }
       		 expect(conHand._runningFlush).to.equal(true);
       		 // TODO: Need to wait for server to finish saving all the requests before we can continue the test
       	 });*/
       	 
        });
});
