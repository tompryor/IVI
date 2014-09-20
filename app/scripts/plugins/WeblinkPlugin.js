/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Models.WebLinkPluginModel = M.Model.extend({
        // The Model Identifier
        idAttribute: '_id',
       
        defaults: {
        	//location: window.navigator.geolocation.getCurrentPosition(function(position){window.alert(position.coords.latitude);}),
        	//vehicle object
        	vehicle: window.navigator.vehicle,
        	
        	//vehicle attributes
        	acceleration: {
        		x: 0,
        		y: 0,
        		z: 0
        	},
        	brand: '',
        	model: '',
        	speed: 0,
        	tripMeter: {
        		averageSpeed: 0,
        		distance: 0,
        		fuelConsumption: 0
        	},
        	vehicleType: '',
        	vin: '',
        	wmi: '',
        	year: 0,
        	
        	//geoLocation Attributes
        	gpsTimestamp: '',
        	gpsAccuracy: '',
        	gpsAltitude: '',
        	gpsAltitudeAccuracy: '',
        	gpsHeading: '',
        	gpsLatitude: '',
        	gpsLongitude: '',
        	gpsSpeed: '',
        	
        	//Listener IDs
        	vehicleSpeedListenerId: -1,
        	geolocationListenerId: -1
        },
    
        get: function(attr) {
            var value = M.Model.prototype.get.call(this, attr);
            return _.isFunction(value) ? value.call(this) : value;
        },
        
		toJSON: function() {
		  var data = {};
		  var json = M.Model.prototype.toJSON.call(this);
		  _.each(json, function(value, key) {
		    data[key] = this.get(key);
		  }, this);
		  return data;
		},
		
		initialize: function () {
			console.debug("WebLinkPluginModel#initialize");
		},
		
		staticValuePoller: function () {
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationPoll();
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vinPoll();
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.wmiPoll();
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.brandPoll();
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.modelPoll();
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vehicleTypePoll();
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.yearPoll();
		},
		
		
		startSubscriptions: function () {
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.accelerationSubscribe();
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.tripMeterSubscribe();
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vehicleSpeedSubscribe();
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationSubscribe();
		},
		
		stopSubscriptions: function () {
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.accelerationUnSubscribe();
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.tripMeterUnSubscribe();
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vehicleSpeedUnSubscribe();
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationUnSubscribe();
		},

		
// Geolocation ---------------------------------------------------------------------------------------------
		
		geolocationOptions: {
			  enableHighAccuracy: false, 
			  maximumAge        : 0, 
			  timeout           : 27000
		},    	

//geolocation using polling
		
		geolocationPollSuccess: function(position){
			var geoObject = position;
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"geolocation": geoObject});
			
			console.log(geoObject);
			
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsTimestamp": geoObject.timestamp});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsAccuracy": geoObject.coords.accuracy});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsAltitude": geoObject.coords.altitude});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsAltitudeAccuracy": geoObject.coords.altitudeAccuracy});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsHeading": geoObject.coords.heading});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsLatitude": geoObject.coords.latitude});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsLongitude": geoObject.coords.longitude});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsSpeed": geoObject.coords.speed});

			//return geoObject;
		},
		
		geolocationPollError: function(error) {
			console.warn('ERROR(' + error.code + '): ' + error.message);
		},
		

		geolocationPoll: function() {
    		if (window.navigator.geolocation) {
    			return window.navigator.geolocation.getCurrentPosition(
    					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationPollSuccess,
    					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationPollError,
    					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationOptions);
    		} else {
    			throw "Geolocation Interface does not exist";
    		}
    	}, 
		
		
// Subscribe based geolocation with watchPosition - doesnt seem to work with local simulator
		geolocationListener: function(position) {
			console.log('pos: ' + position);
			var geoObject = position;
			
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"geolocation": position});
			
			
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsTimestamp": position.timestamp});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsAccuracy": position.coords.accuracy});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsAltitude": position.coords.altitude});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsAltitudeAccuracy": position.coords.altitudeAccuracy});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsHeading": position.coords.heading});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsLatitude": position.coords.latitude});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsLongitude": position.coords.longitude});
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"gpsSpeed": position.coords.speed});
			
		},
		
		geolocationListenError: function(error) {
			console.log("Error retriving geo location");
		},
		


		
		geolocationSubscribe: function() {
			if (window.navigator.geolocation) {
				try{
					var watch = window.navigator.geolocation.watchPosition(
							LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationListener, 
							LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationListenError, 
							LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.geolocationOptions);
					LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"geolocationListenerId": watch});
				}
				catch(error) {
					console.log("Error subscribing to geolocation");  //Need better error handling here
				}
			} else {
				console.log("Geolocation Interface is not available");
			}
		},
		
		geolocationUnSubscribe: function() {
			if (window.navigator.geolocation) {
				try{
					window.navigator.geolocation.clearWatch(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get("geolocationListenerId"));
				}
				catch(error) {
					console.log("Error unsubscribing to geolocation");  //Need better error handling here
				}
			} else {
				console.log("Geolocation Interface is not available");
			}
		},
		
    	
    	
//Running Status ---------------------------------------------------------------------

// Vehicle acceleration ( x, y, and z axis) ------------------------------------------------------
    			
		accelerationListener: function(acceleration) {
			var accel = {
					x: acceleration.x,
					y: acceleration.y,
					z: acceleration.z
			};
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"acceleration": accel});
			//console.log("acceleration changed to: " + acceleration);
		},
		
		accelerationSubscribe: function() {
			if (window.navigator.vehicle) {
				if (window.navigator.vehicle.acceleration.available() === "available"){
					try{
						var sub = window.navigator.vehicle.acceleration.subscribe(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.accelerationListener);
						LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"accelerationListenerId": sub});
					}
					catch(error) {
						console.log("Error subscribing to acceleration: " + error); 
					}
				} else {
					throw "acceleration Interface is not available";
				}
			} else {
				throw "Vehicle Interface does not exist";
			}
		},
		
		accelerationUnSubscribe: function() {
			if (window.navigator.vehicle) {
				if (window.navigator.vehicle.acceleration.available()=== "available"){
					try{
						window.navigator.vehicle.acceleration.unsubscribe(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get("accelerationListenerId"));
					}
					catch(error) {
						console.log("Error unsubscribing to acceleration " + error);  
					}
				} else {
					console.log("acceleration Interface is not available");
				}
			} else {
				console.log("Vehicle Interface is not available");
			}
		},    	

// Vehicle speed -------------------------------------------------------------------------------------
		
		vehicleSpeedListener: function(vehicleSpeed) {
			var vSpeed = vehicleSpeed.speed;
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"speed": vSpeed});
			//console.log("vehicle speed changed to: " + vehicleSpeed.speed);
		},
		
		vehicleSpeedSubscribe: function() {
			if (window.navigator.vehicle) {
				if (window.navigator.vehicle.vehicleSpeed.available()=== "available"){
					try{
						var sub = window.navigator.vehicle.vehicleSpeed.subscribe(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.vehicleSpeedListener);
						LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"vehicleSpeedListenerId": sub});
					}
					catch(error) {
						console.log("Error subscribing to vehicle speed: " + error);  
					}
				} else {
					throw "VehicleSpeed Interface is not available";
				}
			} else {
				throw "Vehicle Interface does not exist";
			}
		},
		
		vehicleSpeedUnSubscribe: function() {
			if (window.navigator.vehicle) {
				if (window.navigator.vehicle.vehicleSpeed.available()=== "available"){
					try{
						window.navigator.vehicle.vehicleSpeed.unsubscribe(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get("vehicleSpeedListenerId"));
					}
					catch(error) {
						console.log("Error unsubscribing to vehicle speed " + error);  
					}
				} else {
					console.log("VehicleSpeed Interface is not available");
				}
			} else {
				console.log("Vehicle Interface is not available");
			}
		},
		
		
// Trip Meter (trip distance, average speed during trip, fuel Consumption)-------------------------------
		
		tripMeterListener: function(tripMeter) {
			var meter = {
					averageSpeed: tripMeter.averageSpeed,
					distance: tripMeter.distance,
					fuelConsumption: tripMeter.fuelConsumption
			};
			LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"tripMeter": meter});
			//console.log("tripMeter changed to: " + tripMeter);
		},
		
		tripMeterSubscribe: function() {
			if (window.navigator.vehicle) {
				if (window.navigator.vehicle.tripMeter.available()=== "available"){
					try{
						var sub = window.navigator.vehicle.tripMeter.subscribe(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.tripMeterListener);
						LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"tripMeterListenerId": sub});
					}
					catch(error) {
						console.log("Error subscribing to tripMeter: " + error);  
					}
				} else {
					throw "tripMeter Interface is not available";
				}
			} else {
				throw "Vehicle Interface does not exist";
			}
		},
		
		tripMeterUnSubscribe: function() {
			if (window.navigator.vehicle) {
				if (window.navigator.vehicle.tripMeter.available()=== "available"){
					try{
						window.navigator.vehicle.tripMeter.unsubscribe(LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.get("tripMeterListenerId"));
					}
					catch(error) {
						console.log("Error unsubscribing to tripMeter " + error);
					}
				} else {
					console.log("tripMeter Interface is not available");
				}
			} else {
				console.log("Vehicle Interface is not available");
			}
		}, 
   
   
// Vehicle identification interface -----------------------------------------------------------------------
    
    // returns the vehicle identification number
    	vinPoll: function() {
			if (window.navigator.vehicle) {
				if (window.navigator.vehicle.identification.available()=== "available"){
					try{
						var vinW = window.navigator.vehicle.identification.VIN;
						LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"vin": vinW});
						console.log("vehicle vinPoll: " + vinW);
					}
					catch(error) {
						console.log("Error getting vehicle's vin: " + error);  
					}
				} else 
					throw "Vehicle Identification Interface is not available";
				
			} else 
				throw "Vehicle Interface is not available";
		},
    	//returns the world manufacturer identifier
		wmiPoll: function() {
			if (window.navigator.vehicle) {
				if (window.navigator.vehicle.identification.available()=== "available"){
					try{
						var wmiW = window.navigator.vehicle.identification.WMI;
						LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"wmi": wmiW});
						console.log("vehicle wmi: " + wmiW);
					}
					catch(error) {
						console.log("Error getting vehicle's wmi: " + error); 
					}
				} else 
					throw "Vehicle Identification Interface is not available";
				
			} else 
				throw "Vehicle Interface is not available";
		},
    //returns the vehicle brand name
		brandPoll: function() {
			if (window.navigator.vehicle) {
				if (window.navigator.vehicle.identification.available()=== "available"){
					try{
						var brandW = window.navigator.vehicle.identification.brand;
						LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"brand": brandW});
						console.log("vehicle brand: " + brandW);
					}
					catch(error) {
						console.log("Error getting vehicle's brand: " + error);  
					}
				} else 
					throw "Vehicle Identification Interface is not available";
				
			} else 
				throw "Vehicle Interface is not available";
		},
    //returns the vehicle model type
		modelPoll: function() {
			if (window.navigator.vehicle) {
				if (window.navigator.vehicle.identification.available()=== "available"){
					try{
						var modelW = window.navigator.vehicle.identification.model;
						LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"model": modelW});
						console.log("vehicle model: " + modelW);
					}
					catch(error) {
						console.log("Error getting vehicle's model: " + error); 
					}
				} else 
					throw "Vehicle Identification Interface is not available";
				
			} else 
				throw "Vehicle Interface is not available";
		},
    //returns the type of the vehicle
		vehicleTypePoll: function() {
			if (window.navigator.vehicle) {
				if (window.navigator.vehicle.identification.available()=== "available"){
					try{
						var vehicleTypeW = window.navigator.vehicle.identification.vehicleType;
						LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"vehicleType": vehicleTypeW});
						console.log("vehicle vehicleType: " + vehicleTypeW);
					}
					catch(error) {
						console.log("Error getting vehicle type: " + error); 
					}
				} else 
					throw "Vehicle Identification Interface is not available";
				
			} else 
				throw "Vehicle Interface is not available";
		},
    //returns the vehicle model year
		yearPoll: function() {
			if (window.navigator.vehicle) {
				if (window.navigator.vehicle.identification.available()=== "available"){
					try{
						var yearW = window.navigator.vehicle.identification.year;
						LibertyMutualIVIBaseApp.Models.WebLinkPluginModel.set({"year": yearW});
						console.log("vehicle year: " + yearW);
					}
					catch(error) {
						console.log("Error getting vehicle year: " + error); 
					}
				} else 
					throw "Vehicle Identification Interface is not available";
				
			} else 
				throw "Vehicle Interface is not available";
		}
});
    
})();
