/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};
LibertyMutualIVIBaseApp = LibertyMutualIVIBaseApp || {};

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function() {
	'use strict';

	LibertyMutualIVIBaseApp.Models.TripModel = M.Model.extend({
		url: function() {
        	return 'http://localhost:9081/ivi/resources/trips?userID=' + this.get("userID"); 
		},
		
		defaults: {
			userID: ''
		}
	});
})();
	

LibertyMutualIVIBaseApp.CoreEngine.TripManager = function(errorHandler, user, bridge){
	this._errorHandler = errorHandler;
	this._user = user;
	this.currentTrip = null;
	this._runningNewTrip = false;

	//New Trip method to grab a user ID from a user model and post that to the server along with a new trip 
	//to get back a trip ID
	this.newTrip = function(){
		if (this._runningNewTrip === true || this.currentTrip){
			return;
		}
		this._runningNewTrip = true;
		var tripManager = this;
		var trip = new LibertyMutualIVIBaseApp.Models.TripModel();
		trip.set({userID: this._user.get("id")});
		trip.save(undefined, {
			success: function (response) {
				tripManager.currentTrip = trip;
				tripManager._runningNewTrip = false;
				console.log("Current Trip ID is: " + tripManager.currentTrip.get("id"));
			},
			
			error: function (response) {
				console.log("Error, no id from server");
				tripManager._errorHandler.onTripCreationError(response);
				tripManager._runningNewTrip = false;
			}
		});
	};

	this.endTrip = function(){
		if (this._runningNewTrip) {
			// Assume that the end trip button will not be visible or clickable until the
			// trip is saved (i.e., server returns trip id).
			return;
		}
		this.currentTrip = null;
	};
	
	// Checking if the autoTrip tracking is set on the model
	// Since this a part of the constructor it will only be called once per application start
	if (this._user.get("trackingSetAutomatically")=== true && bridge.gpsSpeed() > 0){
		this.newTrip();
	}
	
};