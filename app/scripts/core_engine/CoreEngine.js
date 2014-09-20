/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};
LibertyMutualIVIBaseApp = LibertyMutualIVIBaseApp || {};


LibertyMutualIVIBaseApp.CoreEngine = new function(){
	//var instance = {};

	
	//instance.start = function(){
	this.start = function(){
		console.log("CoreEngine#Start");		
		
		console.log("CoreEngine#Make Context Model");	
		LibertyMutualIVIBaseApp.Models.ContextModel = new LibertyMutualIVIBaseApp.Models.ContextModel();
		
		console.log("CoreEngine#Make Device Model");	
		LibertyMutualIVIBaseApp.Models.DeviceModel = new LibertyMutualIVIBaseApp.Models.DeviceModel();
		
		console.log("CoreEngine#Make User Model");	
		LibertyMutualIVIBaseApp.Models.UserModel = new LibertyMutualIVIBaseApp.Models.UserModel();
		
		console.log("CoreEngine#Make Platform Model");	
		LibertyMutualIVIBaseApp.Models.PlatformModel = new LibertyMutualIVIBaseApp.Models.PlatformModel();
		
		console.log("CoreEngine#Make Bridge Model");	
		LibertyMutualIVIBaseApp.Models.BridgeModel = new LibertyMutualIVIBaseApp.Models.BridgeModel();
		
		console.log("CoreEngine#Make Score Model");
		LibertyMutualIVIBaseApp.Models.ScoreModel = new LibertyMutualIVIBaseApp.Models.ScoreModel();
		
		// Globals here use a different name from the class to support testing.
		// Setting up temporary Error Handler Module 
		var temporaryErrorHandler = { onTripCreationError: function(response) {} };
		LibertyMutualIVIBaseApp.CoreEngine.GlobalTripManager = new LibertyMutualIVIBaseApp.CoreEngine.TripManager(temporaryErrorHandler, LibertyMutualIVIBaseApp.Models.UserModel, LibertyMutualIVIBaseApp.Models.BridgeModel);

		console.log("CoreEngine#Start Vehicle Event Manager");
		LibertyMutualIVIBaseApp.CoreEngine.VehicleEventManager.start();
	};
	//return instance;
};

