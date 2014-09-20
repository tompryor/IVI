/*global describe, beforeEach, assert, it  */
'use strict';

describe('Core Engine - Connection Handler', function () {
		var collection;
		var clock;
		var conHand;
		var sandbox;
		
		beforeEach(function() {
			// Create a Sinon sandbox with fake timers that replace window.setTimeout.
			// This lets us test what happens when exact amounts of time pass.
			// Tests make time pass by calling clock.tick.
			// sandbox = sinon.sandbox.create();
			// clock = sandbox.useFakeTimers();
			// Create a fresh ConnectionHandler and its related objects for each test.
			// This prevents different tests from interfering.
			collection = new LibertyMutualIVIBaseApp.Collections.TripEventCollection;
			conHand = new LibertyMutualIVIBaseApp.CoreEngine.TripManager.ConnectionHandler(collection);
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
			//sandbox.restore();
		});
	
        describe('Construct', function () {
          it('Connection Handler should exist', function() {
              expect(conHand).to.exist;
              expect(conHand._flush).to.exist;
           });

          it('Connection Handler fields should be initialized', function() {
        	  expect(conHand._retryCount).to.equal(0);
        	  expect(conHand._runningFlush).to.equal(false);
        	  expect(conHand._offLineMode).to.equal(false);
           });
        });

        describe('Collection Behavior', function () {
        	/*
        	it('Connection Handler saves events', function(done) {
          	  	collection.push('123');
        		conHand.onDataReady();
          	  	expect(conHand._runningFlush).to.equal(true);
          	  	// Check later if the event has been saved and then mark test as done.
          	  	// done is used for async tests to tell Mocha when the test is done, which we
          	  	// need since Prism doesn't return the result immediately.
          	  	// http://www.obeythetestinggoat.com/unit-testing-ajax-calls-if-youre-not-using-a-mocking-library-its-a-world-of-pain-None.html
          	  	// https://www.npmjs.org/package/connect-prism
          	  	window.setTimeout(
          	  			function(){
          	  				expect(conHand._runningFlush).to.equal(false);
          	  				done();
          	  			}, 1500);
             });
        	*/
        	it('Connection Handler does nothing if collection is empty', function() {
        	  conHand.onDataReady();
        	  // Not flushing since nothing to do.
        	  expect(conHand._runningFlush).to.equal(false);
             });

            it('Connection Handler goes to offline mode after 3 errors', function() {
        	  // Put a fake event in the collection. 
        	  collection.push({
        		 // Fake save function that always fails.
        		 save: function(ignored, options) {
        			 // Call error handler after 1 ms of fake time passes.
        			 window.setTimeout(options.error.bind(options), 1);
        		 }
        	  });
        	  // This calls the fake save which schedules the error call.
        	  // No retry yet and not yet offline.
        	  conHand.onDataReady();
        	  expect(conHand._retryCount).to.equal(0);
        	  expect(conHand._runningFlush).to.equal(true);
        	  expect(conHand._offLineMode).to.equal(false);
        	  // Now 1 ms passes and the error call happens.
        	  // TODO: Doesn't work because the collection doesn't let us add fake models.
        	  // We could use a fake collection or a fake server to fix it.
        	  // We could probably use Prism for this test, but we probably need to use fakes
        	  // to test leaving offline mode because Prism would probably return the same result
        	  // forever.
        	  /*
        	  clock.tick(1);
        	  expect(conHand._retryCount).to.equal(1);
        	  expect(conHand._runningFlush).to.equal(true);
        	  expect(conHand._offLineMode).to.equal(false);*/
           });
            
            /*
            describe('Retry', function () {
            	var server;
            	 
            	  beforeEach(function() {
            	    server = sinon.fakeServer.create();
            	  });
            	 
            	  afterEach(function () {
            	    server.restore();
            	  });
            	 
             	 it('should retry to save in 10 seconds from previous attempt', function () {
              		 // program the fake server with pre-determined response
             		 sandbox.server.respondWith([500, {}, 'err']);
             		 expect(conHand._retryCount).to.equal(0);
             		 eventManage.addNewEvent({});
              		 conHand.onDataReady();
              		 sandbox.server.respond();
              		 expect(conHand._retryCount).to.equal(1);
              	 });
              	        	       	 
               });
            */
        });
});