/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};
LibertyMutualIVIBaseApp = LibertyMutualIVIBaseApp || {};

	

LibertyMutualIVIBaseApp.CoreEngine.TripManager.TripEventManager = function(
		tripEventCollection,
		connectionHandler) {
	// Store references to other objects for later use.
	this.tripEventCollection = tripEventCollection;
	this.connectionHandler = connectionHandler;
	
	// _timerID is a reference to the timer that we have started with window.setTimeout.
	// We use this reference to remember whether we have a timer running or not and to cancel it
	// with window.clearTimeout.
	this._timerID = null;
	
    this._send = function() {
    	// Stop the timer if it's running. It will start again on the next event.
    	if (this._timerID != null) {
    		window.clearTimeout(this._timerID);
    		this._timerID = null;
    	}
    	// Tell ConnectionHandler that it should send the data.
    	this.connectionHandler.onDataReady();
    };
    
    this.addNewEvent = function(event) {
    	// Add the event to the end of the TripEventCollection.
    	this.tripEventCollection.push(event); 
    	// If there's more than 20 events, it's time to send.
		if (this.tripEventCollection.size() > 20)  {
			this._send();
		} else if (this._timerID == null) {
			// If there's not more than 20 events and there's no timer running right now, then start the timer.
			// Using bind() to make sure "this" is correct in the _send call.
			// http://stackoverflow.com/questions/2130241/pass-correct-this-context-to-settimeout-callback
    		this._timerID = window.setTimeout(this._send.bind(this), 10000);
    	}
    };
};