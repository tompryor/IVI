LibertyMutualIVIBaseApp.CoreEngine.TripManager = LibertyMutualIVIBaseApp.CoreEngine.TripManager || {};
(function () {
	'use strict';
	
	// need to add code to load from local storage at start
	
	LibertyMutualIVIBaseApp.CoreEngine.TripManager.ConnectionHandler = function (tripEventCollection) {
		// Store a reference to the collection for later use.
		this.tripEventCollection = tripEventCollection;
		
		// _retryCount is the total number of times we have tried and failed to save the current event at the
		// front of the collection. Whenever an event is saved successfully we reset this to 0.
		this._retryCount = 0;
		// _runningFlush becomes true when _flush starts and stays true until everything we have so far is saved.
    	this._runningFlush = false;
    	// _offLineMode is true if we have failed to save the current event at least 3 times in a row.
    	// In offline mode we save all events to local storage since the server might be unavailable for a long time.
    	// We also deliberately create an infinite loop to retry saving the event so that we will know when the
    	// connection and server are available again.
    	this._offLineMode = false;
   
    	// This function is called to save the first event in a batch and also is called again repeatedly to
    	// save the rest.
    	this._flush = function () {
    		// If there's no events left, then we're done flushing.
        	if (this.tripEventCollection.size() == 0) {
        		this._runningFlush = false;
        		return;
        	}
        	// If there's moer events, save the next one.
        	var nextEvent = this.tripEventCollection.at(0);
        	var connHan = this;
        	nextEvent.save(undefined, {
				success: function (response) {
					// Backbone saved the event successfully, so remove it from the collection and
					// save the next one.
					connHan.tripEventCollection.pop();
					connHan._flush();
					// Reset the retry count and turn off offline mode since saving is working now.
					connHan._retryCount = 0;
					connHan._offLineMode = false;
					// Clear all the saved events in local storage since we have just saved the first one
					// and will probably save the rest successfully tto. If not, the error handler will go back to
					// offline more and write whatever is left again.
					delete window.localStorage.offlineEvents;
				},
				
				// Retry on errors and go to offline mode after 3 errors to save all events to local storage.
				// Have to retry forever even in offline mode in order to know when the connection comes back.
				// This is the hearbeat.
				error: function (response) {
					connHan._retryCount ++;
					// Using bind() to make sure "this" is correct in the _send call.
					// http://stackoverflow.com/questions/2130241/pass-correct-this-context-to-settimeout-callback
					window.setTimeout(connHan._flush.bind(connHan), 10000);
					if (connHan._retryCount >= 3) {
			        	connHan._offLineMode = true;
						connHan._storeLocally();
					}
				}
			});
    	};
    	
        this._storeLocally = function () {
        	// slice() makes a shallow copy of the collection as an array and we save it to
        	// a local storage variable. Local storage automatically converts to JSON.
        	window.localStorage.offlineEvents = this.tripEventCollection.slice();
        };
    	
    	this.onDataReady = function () {
    		// If we're not already flushing, start now.
    		if (!this._runningFlush) {
    			this._runningFlush = true;
    			this._flush();
    		} else if (this._offLineMode) {
    			// If we are flushing but we're in offline mode, then update the local storage with the latest events.
        		this._storeLocally();
        	}
    	};
	};
	
})();