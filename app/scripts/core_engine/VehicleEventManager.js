/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};
LibertyMutualIVIBaseApp = LibertyMutualIVIBaseApp || {};


LibertyMutualIVIBaseApp.CoreEngine.VehicleEventManager = new function(){

	var gpsQueue = [];
	//var accelerationQueue = [];
	//var speedQueue = [];
	
	var gpsTimerId = null;
	//var accelerationTimerId = null;
	//var speedTimerId = null;
	
	var gpsPollingRate = 1000;
	//var accelerationPollingRate = 1000;
	//var speedPollingRate = 1000;
	
	var queueSizeLimit = 10;
		
	this.start = function(){
		//this.startPolling();
		
	};
	
	this.getQueue = function() {
		return gpsQueue;
	};
	
	this.startPolling = function() {
		gpsTimerId = setInterval(this.pollGps, gpsPollingRate);
		//accelerationTimerId = setInterval(this.pollAcceleration, accelerationPollingRate);
		//speedTimerId = setInterval(this.pollSpeed, speedPollingRate);
	};
	
	this.stopPolling = function() {
		clearInterval(gpsTimerId);
		//clearInterval(accelerationTimerId);
		//clearInterval(speedTimerId);
	};
	
	this.pollGps = function(){
		
		var gpsEvent = new LibertyMutualIVIBaseApp.Models.VehicleGpsEventModel();
		
		var gpsTimestamp = LibertyMutualIVIBaseApp.Models.BridgeModel.gpsTimestamp();
		var gpsLatitude = LibertyMutualIVIBaseApp.Models.BridgeModel.gpsLatitude();
		var gpsLongitude = LibertyMutualIVIBaseApp.Models.BridgeModel.gpsLongitude();
		
		gpsEvent.set({'timestamp': gpsTimestamp});
		gpsEvent.set({'latitude': gpsLatitude});
		gpsEvent.set({'longitude': gpsLongitude});

		
		if(gpsQueue.length >= queueSizeLimit){
			gpsQueue.pop();
			gpsQueue.push(gpsEvent);
		} else {
			gpsQueue.push(gpsEvent);
		}
	};
	/*
	this.pollAcceleration = function(){
		
		var accelerationEvent = [
        	LibertyMutualIVIBaseApp.Models.BridgeModel.gpsTimestamp(),
        	LibertyMutualIVIBaseApp.Models.BridgeModel.acceleration()
        ];
		
		if(accelerationQueue.length >= queueSizeLimit){
			accelerationQueue.pop();
			accelerationQueue.push(accelerationEvent);
		} else {
			accelerationQueue.push(accelerationEvent);
		}
	};
	
	this.pollSpeed = function(){
		
		var speedEvent = [
        	LibertyMutualIVIBaseApp.Models.BridgeModel.gpsTimestamp(),
        	LibertyMutualIVIBaseApp.Models.BridgeModel.speed()
        ];
		
		if(speedQueue.length >= queueSizeLimit){
			speedQueue.pop();
			speedQueue.push(speedEvent);
		} else {
			speedQueue.push(speedEvent);
		}
	};
	*/
};