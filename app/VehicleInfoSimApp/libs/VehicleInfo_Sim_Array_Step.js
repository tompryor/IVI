/**
 *
 * @file VehicleInfo_Sim.js
 * @fileOverview
 * Library that implements the Vehicle API as defined by the W3C.
 * The latest draft for the Vehicle Information API can be found here:
 *  https://rawgit.com/w3c/automotive-bg/master/snapshots/vehicle_spec_snapshot_latest.html
 * The latest draft for the Vehicle Data Interfaces can be found here:
 * https://rawgit.com/w3c/automotive-bg/master/snapshots/data_spec_snapshot_latest.html
 *
 * The library stores and reads vehicle attribute data in the local storage.
 * There is an html app called VehicleInfoSimApp that allows to change and update
 * the values using graphical UI in a browser.
 * 
 * @author Abalta Technologies, Inc.
 * @date July 2014
 *
 * @cond Copyright
 *
 * COPYRIGHT 2014 ABALTA TECHNOLOGIES ALL RIGHTS RESERVED.<p>
 * This program may not be reproduced, in whole or in
 * part in any form or any means whatsoever without the
 * written permission of ABALTA TECHNOLOGIES NAME".
 *
 * @endcond
 */




/**
 * @namespace Namespace of the current web application.
 */
window.abaltatech = window.abaltatech || {};
window.abaltatech.vehicleinfo_sim = window.abaltatech.vehicleinfo_sim || {};
var ns_vehicleinfo = window.abaltatech.vehicleinfo_sim;

ns_vehicleinfo.notificationList = new ns_vehicleinfo.NotificationList();
ns_vehicleinfo.m_timer = 0;
ns_vehicleinfo.m_started = false;

/** 
 * File simulation data
 */
ns_vehicleinfo.m_fileSim = {
	status: 'not started',
	data: [],
	locationData: {
		latitude: [],
		longitude: [],
		altitude: [],
		accuracy: [],
		altitudeAccuracy: [],
		timestamp: [],
		heading: [], 
		speed: []
	},
	numRecords: 0,
	position: 1,
	timer: null,
	interval: 1000,
	subscribeTimer: null
}

ns_vehicleinfo.m_prevGeolocation = null;

/*****************************************************************************
 * Public simulation APIs
 * Use these functions to start/stop and control the simulation process.
 *****************************************************************************/

// Starts the vehicle info simulation
ns_vehicleinfo._startSimulation = function() {
    if(! this.m_started) {
        console.debug("Starting the simulation.");        
        this.m_prevVehicleObj = window.navigator.vehicle;
        window.navigator.vehicle = new ns_vehicleinfo.Vehicle();
        localStorage.setItem ("abaltatech_vehdata_timestamp", 0);    
        this.m_started = true;
    }
};

// Stops the vehicle info simulation
ns_vehicleinfo._stopSimulation = function() {
    if(this.m_started) {
        window.navigator.vehicle = this.m_prevVehicleObj;
    }
    this.m_prevVehicleObj = undefined;
    this.m_started = false;
};

// Checks if simulation has started
ns_vehicleinfo._isSimulationStarted = function() {
    return this.m_started;
};

/** 
 * File simulation methods.
 */
ns_vehicleinfo._getFileSimulationStatus = function() {
	return this.m_fileSim.status; 
};
ns_vehicleinfo._startFileSimulation = function(file, timeInterval, simulatePosition) {
	if(file[0] && timeInterval > 0) {
		ns_vehicleinfo.m_fileSim.status = 'started';		
		if($.isArray(file)) {
			// Data is already in array format, so no processing necessary
			ns_vehicleinfo._filterValidSimData(file);
			ns_vehicleinfo.m_fileSim.interval = timeInterval;
			ns_vehicleinfo._resumeFileSimulation();

		} else {
			// Parse file contents
			var reader = new FileReader();
			console.debug("Initializing new reader.");

			reader.onerror = function() {
				console.error("Not started: an error occurred processing the file.");
				ns_vehicleinfo.m_fileSim.status = 'error';

				return false;
			};

		    // Read all the file at once and save into 2D array
			reader.onloadend = function(evt) {
				if(evt.target.readyState === FileReader.DONE) {
		       		var fileContents = evt.target.result;
		       		ns_vehicleinfo._filterValidSimData($.csv.toArrays(fileContents));
		          	ns_vehicleinfo.m_fileSim.interval = timeInterval;	          	
		          	ns_vehicleinfo._resumeFileSimulation();		
		          	console.debug("OK, new file loaded.");		
				}
			};
				
		    reader.readAsText(file[0]);
			//ns_vehicleinfo.m_fileSim.status = 'running';		    
		}
	
		if(simulatePosition) {
			this._initLocationSim();
		}	

	    return true;
	}
};
ns_vehicleinfo._stopFileSimulation = function() {
	this.m_fileSim.status = 'not started';
	clearInterval(this.m_fileSim.timer);
	if(this.m_prevGeolocation) {
		window.navigator.geolocation = this.m_prevGeolocation;
	}
	this._resetFileSimData();	
};
ns_vehicleinfo._pauseFileSimulation = function() {
	if(this.m_fileSim.status === 'not started') {
		console.error("File needs to be started first!")
		return;
	}
	this.m_fileSim.status = 'paused';
	clearInterval(this.m_fileSim.timer);
}
ns_vehicleinfo._resumeFileSimulation = function() {
	if(this.m_fileSim.status === 'not started') {
		console.error("File needs to be started first!")
		return;
	}
	this.m_fileSim.status = 'running';
	this.m_fileSim.timer = setInterval(ns_vehicleinfo._onFileSimProgress, ns_vehicleinfo.m_fileSim.interval);
}
// Private simulation methods
ns_vehicleinfo._onFileSimError = function(msg) {
	console.error(msg);
	this.m_fileSim.status = 'error';
}
ns_vehicleinfo._onFileSimProgress = function() {
	$.each(ns_vehicleinfo.m_fileSim.data, function(i, entry) {
		entry.interface._setValue(entry.attribute, entry.values[ns_vehicleinfo.m_fileSim.position], entry.zone);
	});

	$.each(ns_vehicleinfo.m_fileSim.locationData, function(property, values) {
		localStorage.setItem("abaltatech_vehdata_geo_" + property, values[ns_vehicleinfo.m_fileSim.position] || 0);
	});

	ns_vehicleinfo._updateFileSimPosition();
}
ns_vehicleinfo._filterValidSimData = function(csv) {
	console.debug("Data: " + csv);
	var isValid = function(type, valueString) {
		var value = Math.abs(parseFloat(valueString));
		var isValid = false;
		if(!isNaN(value)) {
			if(type === 'latitude') {
				isValid = (value <= 90);
			}
			if(type === 'longitude') {
				isValid = (value <= 180);
			}
		}
		return isValid;
	}

	var invalidRowValues = {latitude: [], longitude: []};

	// Iterate through each of the column names
	$.each(csv[0], function(col, name) {
		var nameToLower = name.toLowerCase();

		// Search for columns by their exact names and store them
		if( nameToLower === 'latitude' || nameToLower === 'longitude'
			|| nameToLower === 'altitude' || nameToLower === 'heading') {
			// Set ternary values
			$.each(csv, function(row, arr) {
				if(invalidRowValues[nameToLower] && !isValid(nameToLower, arr[col])) {
					invalidRowValues[nameToLower].push(row);
				}
				ns_vehicleinfo.m_fileSim.locationData[nameToLower].push(arr[col]);
			});
		}
		// Find the timestamp column separately, since it may be labeled differently
		else if(nameToLower.indexOf('time') > -1) {
			$.each(csv, function(row, arr) {
				ns_vehicleinfo.m_fileSim.locationData.timestamp.push(arr[col]);
			});
		}
		else {
			// Parse name to get the interface, attribute, and zone		
			var values = name.split('_');
			var entry = {
				interface : window.navigator.vehicle[values[0]],
				attribute : values[1],
				zone : values[2],
				values: []		
			}

			//console.debug("attribute?" + (entry.interface && entry.interface.attribute !== 'undefined'));
			if(entry.interface 
					&& (entry.interface.attribute !== 'undefined')
					&& (!entry.zone || entry.interface.zones.contains(entry.zone))) 
			{
				$.each(csv, function(row, arr) {
					entry.values.push(arr[col]);

					// If this is vehicle speed, add it as part of the location data
					if(name === 'vehicleSpeed_speed') {
						var speed = arr[col];
						if(!isNaN(arr[col])) {
							speed = speed * 0.277778; // km/hr to meters/s
						}
						ns_vehicleinfo.m_fileSim.locationData.speed.push(speed);						
					}					
				});
				ns_vehicleinfo.m_fileSim.data.push(entry);
			} else {
				console.warn(name + " is not a valid vehicle property.");				
			}		
		}
	});
	// Remove all location data rows without a valid longitude or latitude
	// First sort the rows to be removed in descending order
	var invalidRows = invalidRowValues.latitude.concat(invalidRowValues.longitude).sort(function(a, b) { return b - a });
	invalidRows = invalidRows.filter(function(el, index, arr) { return index == arr.indexOf(el)});

	$.each(invalidRows, function(i, row) {
		$.each(ns_vehicleinfo.m_fileSim.locationData, function(type, data) {
			data.splice(row, 1);
		});
	});
	console.debug(ns_vehicleinfo.m_fileSim.locationData);

	ns_vehicleinfo.m_fileSim.numRecords = csv.length - invalidRows.length;
}
ns_vehicleinfo._updateFileSimPosition = function() {
	this.m_fileSim.position++;	

	if(this.m_fileSim.position >= this.m_fileSim.numRecords) {
		console.log("File simulator: reached end of records. Restarting.");
		this.m_fileSim.position = 0;
	}
}

ns_vehicleinfo._getLocationObject = function() {
	var position = ns_vehicleinfo.m_fileSim.position || 0;	
	var coords = { 
		latitude: parseFloat(localStorage.getItem("abaltatech_vehdata_geo_latitude")) || 0,
		longitude: parseFloat(localStorage.getItem("abaltatech_vehdata_geo_longitude")) || 0,
		altitude: parseFloat(localStorage.getItem("abaltatech_vehdata_geo_altitude"))  || 0,
		accuracy: 10,
		altitudeAccuracy: 10,
		heading: parseFloat(localStorage.getItem("abaltatech_vehdata_geo_heading")) || 0,
		speed: parseFloat(localStorage.getItem("abaltatech_vehdata_geo_speed")) || 0
	}	
	return {
		coords: coords, 
		timestamp: localStorage.getItem("abaltatech_vehdata_geo_timestamp")
	}
}
ns_vehicleinfo._initLocationSim = function() {
	console.debug("Simulating position");
	this.m_prevGeolocation = navigator.geolocation;
	navigator.geolocation.getCurrentPosition 
		= function(successCallback, errorCallback, options) {
			successCallback(ns_vehicleinfo._getLocationObject());
	};

	navigator.geolocation.watchPosition
		= function(successCallback, errorCallback, options) {
	        var listener = {};
	        listener['getLocation'] = successCallback;
	        var handle = ns_vehicleinfo.notificationList.registerListener( listener );

	        if(!ns_vehicleinfo.m_fileSim.timer) {	
				ns_vehicleinfo.m_fileSim.timer = setInterval(function() {
					ns_vehicleinfo.notificationList.notifyAll('getLocation', [ns_vehicleinfo._getLocationObject()]);	
				}, ns_vehicleinfo.m_fileSim.interval);
	        }
	        return handle;
	}
	navigator.geolocation.clearWatch = function(watchId) {
			ns_vehicleinfo.notificationList.unregisterListener(watchId);
	}	
}
ns_vehicleinfo._resetFileSimData = function () {
	ns_vehicleinfo.m_fileSim = {
		status: 'not started',
		data: [],
		locationData: {
			latitude: [],
			longitude: [],
			altitude: [],
			accuracy: [],
			altitudeAccuracy: [],
			timestamp: [],
			heading: [], 
			speed: []
		},
		numRecords: 0,
		position: 1,
		timer: null,
		interval: 1000,
		subscribeTimer: null
	}	
}

/*****************************************************************************
 * Public Vehicle Information APIs
 * 
 *****************************************************************************/

ns_vehicleinfo.VehicleInterface = function(attrName, valueNames, zone) {
    // Public attributes:
    this.supported = false;
    this.zones = zone;
    
    // Private attributes:
    this.m_attrName = attrName;
    this.m_valueNames = {None: []};
    
    this.m_lastAvailabilityTimeStamp = 0;
    this.m_available = ns_vehicleinfo.Availability.NOT_SUPPORTED;
    
    //var recentArray = $.parseJSON(recent.split(','));
};


ns_vehicleinfo.Zone = function (validZones) {
  // Public attributes
  this.driver = ns_vehicleinfo.Zone.FRONT;
  this.passenger = ns_vehicleinfo.Zone.REAR;
  this.value = validZones; // This can be read from local storage
};

ns_vehicleinfo.Zone.FRONT = "Front";  
ns_vehicleinfo.Zone.MIDDLE = "Middle";
ns_vehicleinfo.Zone.RIGHT = "Right";
ns_vehicleinfo.Zone.LEFT = "Left";
ns_vehicleinfo.Zone.REAR = "Rear";
ns_vehicleinfo.Zone.CENTER = "Center";
ns_vehicleinfo.Zone.m_NO_ZONE = "None";



ns_vehicleinfo.Zone.prototype.contains = function(zone) {
//    for ( var j = 0; j < this.value.length; j++ ) {
//        if ( !(zone.value.indexOf(this.value[j])) ) {
//            return false;
//        }
//    }   
//    return true;
    return (this.value.indexOf(zone) !== -1)

};

ns_vehicleinfo.Zone.prototype.equals = function (zone) {
    if ( zone.value.length !== this.value.length) {
        return false;
    }
    
    for ( var i = 0; i < zone.value.length; i++ ) {
        if ( !(this.contains(zone[i])) ) {
            return false;
        }
    }
    
    for ( var i = 0; i < this.value.length; j++) {
        if ( !(zone.contains(this[j])) ) {
            return false;
        }
    }
    
    return true;
};

// Enum VehicleError
ns_vehicleinfo.VehicleError = {
    PERMISSION_DENIED : "permission_denied",
    INVALID_OPERATION : "invalid_operation",
    TIMEOUT : "timeout",
    INVALID_ZONE : "invalid_zone",
    UNKNOWN : "unknown"
};

ns_vehicleinfo.VehicleInterfaceError = function (error, msg) {
    // Public attributes
    this.error = error;
    this.message = msg;
};


// Enum Availability
ns_vehicleinfo.Availability = {
    AVAILABLE : "available",
    NOT_SUPPORTED : "not_supported",
    NOT_SUPPORTED_YET : "not_supported_yet",
    NOT_SUPPORTED_SECURITY : "not_supported_security",
    NOT_SUPPORTED_POLICY : "not_supported_policy",
    NOT_SUPPORTED_OTHER : "not_supported_other"
};

// Enum FuelConfiguration
ns_vehicleinfo.FuelConfiguration = {
    GASOLINE : "gasoline",
    METHANOL: "methanol",
    ETHANOL: "ethanol",
    DIESEL : "diesel",
    LPG : "lpg",
    CNG : "cng",
    PROPANE : "propane",
    ELECTRIC : "electric"
};

// Enum TransmissionConfiguration
ns_vehicleinfo.TransmissionConfiguration = {
  AUTO : "auto",
  MANUAL : "manual",
  CVT : "cvt"
};

// Enum VehiclePowerModeType
ns_vehicleinfo.VehiclePowerModeType = {
    OFF : "off",
    ACCESSORY1 : "accessory1",
    ACCESSORY2 : "accessory2",
    RUNNING : "running"
};

// Enum Transmission
ns_vehicleinfo.Transmission = {
    PARK :"park",
    REVERSE : "reverse",
    NEUTRAL : "neutral",
    DRIVE : "drive"
};

// Enum DriverMode
ns_vehicleinfo.DriveMode = {
    COMFORT : "comfort",
    AUTO : "auto",
    SPORT : "sport",
    ECO : "eco",
    MAUNUAL : "manual"
};

// Enum Door
ns_vehicleinfo.Door = {
    OPEN : "open",
    AJAR : "ajar",
    CLOSE : "close"
};

// Enum Seat
ns_vehicleinfo.Seat = {
    ADULT : "adult",
    CHILD : "child",
    VACANT : "vacant"
};

// Enum WiperSetting
ns_vehicleinfo.WiperSetting = {
    OFF : "off",
    ONCE : "once",
    SLOWEST : "slowest",
    SLOW : "slow",
    MIDDLE : "middle",
    FAST : "fast",
    FASTEST : "fastest",
    AUTO : "auto"
};

// Enum ConvertibleRoof
ns_vehicleinfo.ConvertibleRoof = {
    CLOSED : "closed",
    CLOSING : "closing",
    OPENING : "opening",
    OPENED : "opened"
};

// Enum ClimateControl
ns_vehicleinfo.ClimateControl = {
    FRONTPANEL : "frontpanel",
    FLOORDUCT : "floorduct",
    BILEVEL : "bilevel",
    DEFROSTFLOOR : "defrostfloor"
};

// Enum LaneDepartureDetection
ns_vehicleinfo.LaneDepartureDetection = {
    OFF : "off",
    PAUSE : "pause",
    RUNNING : "running"
};

// Enum Alarm
ns_vehicleinfo.Alarm = {
   DISARMED :  "disarmed",
    PREARMED : "prearmed",
    ARMED : "armed",
    ALARMED : "alarmed"
};

// Enum ParkingBrake
ns_vehicleinfo.ParkingBrakes = {
    INACTIVE : "inactive",
    ACTIVE : "active",
    ERROR : "error"
};
ns_vehicleinfo.Availability.isValidValue = function( valueToCheck ) {
    if (ns_vehicleinfo.Availability.AVAILABLE === valueToCheck) return true;
    if (this.NOT_SUPPORTED === valueToCheck) return true;
    if (this.NOT_SUPPORTED_YET === valueToCheck) return true;
    if (this.NOT_SUPPORTED_SECURITY === valueToCheck) return true;
    if (this.NOT_SUPPORTED_POLICY === valueToCheck) return true;
    if (this.NOT_SUPPORTED_OTHER === valueToCheck) return true;
 

    return false;
};


ns_vehicleinfo.VehicleInterface.prototype.available = function() {
    return this._getAvailable().availability;
};

ns_vehicleinfo.VehicleInterface.prototype.availabilityChangedListener = function( callback ) {
    
    var listener = {};
    listener[this.m_attrName + "Available"] = callback;
    var handle = ns_vehicleinfo.notificationList.registerListener( listener );
    

    if (!ns_vehicleinfo.m_timer ) {
        ns_vehicleinfo._startTimer();
    } 

    return handle;
};

ns_vehicleinfo.VehicleInterface.prototype.removeAvailabilityChangedListener = function ( handle ) {
    ns_vehicleinfo.notificationList.unregisterListener(handle);
    
};

/**
 * must return the Promise. The "resolve" callback in the promise is used to pass the vehicle data
 * type that corresponds to the specific VehicleInterface instance. For example, 
 * "vehicle.vehicleSpeed" corresponds to the "VehicleSpeed" data type
 */
ns_vehicleinfo.VehicleInterface.prototype.get = function ( zone ) {
    var promise = new Promise($.proxy(function(resolve, reject) {
    // do a thing, possibly async, then…

    if(zone && !this.zones.contains(zone)) {
        reject(new ns_vehicleinfo.VehicleInterfaceError(ns_vehicleinfo.VehicleError.INVALID_ZONE));
    }
    
    if ( this.available() === ns_vehicleinfo.Availability.AVAILABLE ) {
        if ( !zone ) {
            zone = ns_vehicleinfo.Zone.m_NO_ZONE;
        }
        resolve( this._getVehicleObject(zone).vehicleObject);
    }
    else {
      reject(new ns_vehicleinfo.VehicleInterfaceError(ns_vehicleinfo.VehicleError.PERMISSION_DENIED, "Cannot call get(); vehicle interface " + this.m_attrName + " is not available."));
    }
  }, this));
  
  return promise;
};


ns_vehicleinfo.VehicleInterface.prototype.set = function ( value, zone ) {
    var promise = new Promise ($.proxy(function(resolve, reject) {
        // If there is a zone present, but is not a valid zone 
        if(zone && !this.zones.contains(zone)) {
            reject(new ns_vehicleinfo.VehicleInterfaceError(ns_vehicleinfo.VehicleError.INVALID_ZONE));
        }
        // If the property is available
        if ( this.available() === ns_vehicleinfo.Availability.AVAILABLE  ) {
            // If no zone make it equal "None"
            if ( !zone ) {
                zone = ns_vehicleinfo.Zone.m_NO_ZONE;
            }
        // Iterates through the subProperties
        $.each(this.m_valueNames[zone].values, $.proxy(function(i, property) {
            // Handle cases where zone is in the parameter   
            if ( value[property]) {
                this._setValue(property, value[property], zone);
            }

        }, this ));
        resolve();
        }
        else {
          reject(new ns_vehicleinfo.VehicleInterfaceError(ns_vehicleinfo.VehicleError.PERMISSION_DENIED, "Vehicle interface " + this.m_attrName + " is not available."));
        }

  }, this));

  return promise;
      
};

// Keep track of changes
// create notifiucation list in constructor and adding to it in subscribe
// adding the id ( just a number), returned in this function
ns_vehicleinfo.VehicleInterface.prototype.subscribe = function ( callback, zone ) {
    // If no error, return the handle to the subscription
    // From the callback method passed in?
    
    if ( this.available() === "available") {
        var listener = {};
        listener[this.m_attrName + "_" + (zone || ns_vehicleinfo.Zone.m_NO_ZONE)] = callback;
        console.debug("Registering with listenr " + (this.m_attrName + "_" + (zone || ns_vehicleinfo.Zone.m_NO_ZONE)));
        var handle = ns_vehicleinfo.notificationList.registerListener( listener );

        if (!ns_vehicleinfo.m_timer) { 
            //&& ns_vehicleinfo.m_subscribers.length <= 0  ) {
            ns_vehicleinfo._startTimer();
        } 
        return handle;
    }
    
    else {
        return 0;
    }
};

// Unsubscribes to value changes on this interface
ns_vehicleinfo.VehicleInterface.prototype.unsubscribe = function ( handle ) {
    
    ns_vehicleinfo.notificationList.unregisterListener(handle);
};





/*****************************************************************************
 * Private Vehicle Information APIs (to be used by the simulator app).
 * Do not call directly.
 * 
 *****************************************************************************/

// Save method
ns_vehicleinfo.VehicleInterface.prototype._setAvailable = function(availableVal) {
        
    // Make sure the value is valid first
    if( !ns_vehicleinfo.Availability.isValidValue( availableVal ) ) {
        availableVal = ns_vehicleinfo.Availability.NOT_SUPPORTED;
    }
    // abaltatech_vehdata_<m_attrName>     
   localStorage.setItem("abaltatech_vehdata_" + this.m_attrName, availableVal);
};

ns_vehicleinfo.VehicleInterface.prototype._getAvailable = function () {

    var oldVal = this.m_available; 
    var newVal = localStorage.getItem("abaltatech_vehdata_" + this.m_attrName); 

    if( !ns_vehicleinfo.Availability.isValidValue( newVal ) ) {
        // If not a valid value, set to NOT_SUPPORTED by default
        newVal = ns_vehicleinfo.Availability.NOT_SUPPORTED
    }         

    this.supported = (newVal === ns_vehicleinfo.Availability.AVAILABLE);
    this.m_available = newVal;

    this.m_lastAvailablityTimeStamp  = new Date().getTime();

    return {
        'availability' : newVal,
        'changed' : (oldVal !== newVal)
    };  
};


ns_vehicleinfo.VehicleInterface.prototype._getVehicleObject = function(zone) {
        var vehicleObject = {};
        var changed = false;

        if ( !zone ) {
            zone = ns_vehicleinfo.Zone.m_NO_ZONE;
        }
        $.each ( this.m_valueNames[zone].values, $.proxy(function(index, properties) {
            var oldVal = this[index];
            var nextVal = this._getValue (properties, zone);
            if ( nextVal !== oldVal ) {
                changed = true;
            }
            vehicleObject[properties] = nextVal;
        }, this ));
        
        vehicleObject["timestamp"] = new Date().getTime();   
        // console.debug("Vehicle object!");    
        // console.debug(vehicleObject);
        
        return {
            'vehicleObject' : vehicleObject,
            'changed' : changed
        };
};


// Get method
ns_vehicleinfo.VehicleInterface.prototype._getValueNames = function() {
    
    return this.m_valueNames;
};

ns_vehicleinfo.VehicleInterface.prototype._setValue = function( valueName, value, zone ) {
    var name = "abaltatech_vehdata_" + this.m_attrName + "_" + valueName;
    if(zone && zone !== ns_vehicleinfo.Zone.m_NO_ZONE) {
        name += "_" + zone;     
    }
    localStorage.setItem("abaltatech_vehdata_timestamp", new Date().getTime() );
    return localStorage.setItem(name, value);   
};

ns_vehicleinfo.VehicleInterface.prototype._getValue = function( valueName, zone ) {   
    var name = "abaltatech_vehdata_" + this.m_attrName + "_" + valueName; 
    if(zone && zone !== ns_vehicleinfo.Zone.m_NO_ZONE) {
        name += "_" + zone;
    }
    this.m_valueNames[zone].timestamp = new Date().getTime();
    return localStorage.getItem(name);    
};

ns_vehicleinfo.Vehicle = function() {     
    var vehicleSpeedValues = {};
    vehicleSpeedValues[ns_vehicleinfo.Zone.m_NO_ZONE] = {"speed" : 0};
//    this.vehicleSpeed = new ns_vehicleinfo.VehicleInterface("vehicleSpeed", vehicleSpeedValues, new ns_vehicleinfo.Zone([]));
//    this.vehicleSpeed.speed = 0;
    this.vehicleSpeed = this._buildVehicleInterface("vehicleSpeed", vehicleSpeedValues);
    
    var engineSpeedValues = {};
    engineSpeedValues[ns_vehicleinfo.Zone.m_NO_ZONE] = {"speed" : 0};
    this.engineSpeed = this._buildVehicleInterface("engineSpeed", engineSpeedValues);
    
    var identificationValues = {};
    identificationValues[ns_vehicleinfo.Zone.m_NO_ZONE] = {"VIN" : 50, "WMI": 0, "brand" : null, "model" : "T", "vehicleType": "Sedan", "year": 2013};
    this.identification = this._buildVehicleInterface("identification", identificationValues);

    var sizeConfigurationValues = {};
    sizeConfigurationValues[ns_vehicleinfo.Zone.m_NO_ZONE] = {"width": 0, "height": 0, "_length" : 0, "doorsCount" : 2, "totalDoors" : 2, "vehicleType" : null};
    this.sizeConfiguration = this._buildVehicleInterface("sizeConfiguration", sizeConfigurationValues);
    
    var fuelConfigurationValues = {};
    fuelConfigurationValues[ns_vehicleinfo.Zone.m_NO_ZONE] = {"fuelType" : 0, "refuelPosition" : 0};
    this.fuelConfiguration = this._buildVehicleInterface("fuelConfiguration", fuelConfigurationValues);
    
    var transmissionConfigurationValues = {};
    transmissionConfigurationValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["transmissionGearType"];
    this.transmissionConfiguration = this._buildVehicleInterface("transmissionConfiguration", transmissionConfigurationValues);    

    var wheelConfigurationValues = {};
    wheelConfigurationValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["frontWheelRadius", "rearWheelRadius", "wheelInfoRadius"];
    this.wheelConfiguration = this._buildVehicleInterface("wheelConfiguration", wheelConfigurationValues); 

    var steeringConfigurationValues = {};
    steeringConfigurationValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["steeringWheelLeft"];
    this.steeringConfiguration = this._buildVehicleInterface("steeringConfiguration", steeringConfigurationValues); 

    var vehiclePowerModeTypeValues = {};
    vehiclePowerModeTypeValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["value"];
    this.vehiclePowerModeType = this._buildVehicleInterface("vehiclePowerModeType", vehiclePowerModeTypeValues); 
    
    var powerTrainTorqueValues = {};
    powerTrainTorqueValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["value"];
    this.powerTrainTorque = this._buildVehicleInterface("powerTrainTorque", powerTrainTorqueValues); 
    
    var acceleratorPedalPositionValues = {};
    acceleratorPedalPositionValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["value"];
    this.acceleratorPedalPosition = this._buildVehicleInterface("acceleratorPedalPosition", acceleratorPedalPositionValues); 
    
    var throttlePositionValues = {};
    throttlePositionValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["value"];
    this.throttlePosition = this._buildVehicleInterface("throttlePosition", throttlePositionValues); 
    
    var tripMeterValues = {};
    tripMeterValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["averageSpeed", "distance", "fuelConsumption"];
    this.tripMeter = this._buildVehicleInterface("tripMeter", tripMeterValues); 
    
    var diagnosticValues = {};
    diagnosticValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["accumulatedEngineRuntime", "distanceSinceCodeCleared", "distanceWithMILOn", "timeRunMILOn", "timeTroubleCodeClear"];
    this.diagnostic = this._buildVehicleInterface("diagnostic", diagnosticValues); 
    
    var transmissionValues = {};
    transmissionValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["gear", "mode"];
    this.transmission = this._buildVehicleInterface("transmission", transmissionValues); 
    
    var cruiseControlStatusValues = {};
    cruiseControlStatusValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["Speed", "status"];
    this.cruiseControlStatus = this._buildVehicleInterface("cruiseControlStatus", cruiseControlStatusValues); 
    
    var lightStatusValues = {};
    lightStatusValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["automaticHeadlights", "brake", "dynamicHighBeam", "fog", "hazard", "head", "highBeam", "leftTurn", "parking", "rightTurn"];
    this.lightStatus = this._buildVehicleInterface("lightStatus", lightStatusValues);
    
    var interiorLightStatusValues = {};
    interiorLightStatusValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["status"];
    this.interiorLightStatus = this._buildVehicleInterface("interiorLightStatus", interiorLightStatusValues);
    
    var hornValues = {};
    hornValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["status"];
    this.horn = this._buildVehicleInterface("Horn", hornValues);
    
    var chimeValues = {};
    chimeValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["status"];
    this.chime = this._buildVehicleInterface("chime", chimeValues);
    
    var fuelValues = {};
    fuelValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["averageConsumption", "fuelConsumedSinceRestart", "instantConsumption", "level", "range", "vehicleTimeSinceRestart"];
    this.fuel = this._buildVehicleInterface("fuel", fuelValues);
    
    var engineOilValues = {};
    engineOilValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["change", "pressure", "remaining", "temperature"];
    this.engineOil = this._buildVehicleInterface("engineOil", engineOilValues);
    
    var accelerationValues = {};
    accelerationValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["x", "y", "z"];
    this.acceleration = this._buildVehicleInterface("acceleration", accelerationValues);
    
    var engineCoolantValues = {};
    engineCoolantValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["level", "temperature"];
    this.engineCoolant = this._buildVehicleInterface("engineCoolant", engineCoolantValues);
    
    var deadReckoningValues = {};
    deadReckoningValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["steeringWheelAngle", "wheelTickSensor"];
    this.deadReckoning = this._buildVehicleInterface("deadReckoning", deadReckoningValues);
    
    var odometerValues = {};
    odometerValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["distanceSinceStart", "distanceTotal"];
    this.odometer = this._buildVehicleInterface("odometer", odometerValues);
    
    var transmissionOilValues = {};
    transmissionOilValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["temperature", "wear"];
    this.transmissionOil = this._buildVehicleInterface("transmissionOil", transmissionOilValues);
    
    var transmissionClutchValues = {};
    transmissionClutchValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["wear"];
    this.transmissionClutch = this._buildVehicleInterface("transmissionClutch", transmissionClutchValues);
    
    var brakeValues = {};
//brakeValues[ns_vehicleinfo.Zone.m_NO_ZONE] = {"fluidLevelLow" : 0};
    brakeValues[ns_vehicleinfo.Zone.m_NO_ZONE] = {"brakesWorn" : true, "fluidLevel" : 0, "fluidLevelLow" : 40};
    brakeValues[ns_vehicleinfo.Zone.FRONT] = ["padWear"];
    brakeValues[ns_vehicleinfo.Zone.REAR] = ["padWear"];
    brakeValues[ns_vehicleinfo.Zone.LEFT] = ["padWear"];
    brakeValues[ns_vehicleinfo.Zone.RIGHT] = ["padWear"];
    this.brake = this._buildVehicleInterface("brake", brakeValues);
    
    var washerFluidValues = {};
    washerFluidValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["level", "levelLow"];
    this.washerFluid = this._buildVehicleInterface("washerFluid", washerFluidValues);
    
    var malfunctionIndicatorValues = {};
    malfunctionIndicatorValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["on"];
    this.malfunctionIndicator = this._buildVehicleInterface("malfunctionIndicator", malfunctionIndicatorValues);
    
    var batteryStatusValues = {};
    batteryStatusValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["chargeLevel", "current", "voltage"];
    this.batteryStatus = this._buildVehicleInterface("batteryStatus", batteryStatusValues);
    
    var tireValues = {};
    tireValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["pressure", "pressureLow", "temperature"];
    this.tire = this._buildVehicleInterface("tire", tireValues);
    
    var driverIdentificationValues = {};
    driverIdentificationValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["driverID", "keyFobID"];
    this.driverIdentification = this._buildVehicleInterface("driverIdentification", driverIdentificationValues);
    
    var languageValues = {};
    languageValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["language"];
    this.language = this._buildVehicleInterface("language", languageValues);
    
    var unitsOfMeasureValues = {};
    unitsOfMeasureValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["isMKSSystem", "unitsDistance", "unitsFuelConsumption", "unitsFuelVolume", "unitsSpeed"];
    this.unitsOfMeasure = this._buildVehicleInterface("unitsOfMeasure", unitsOfMeasureValues);
    
    var mirrorValues = {};
    mirrorValues[ns_vehicleinfo.Zone.LEFT] = {"mirrorPan" : 0};
    mirrorValues[ns_vehicleinfo.Zone.LEFT] = ["mirrorPan", "mirrorTilt"];
    mirrorValues[ns_vehicleinfo.Zone.RIGHT] = ["mirrorPan", "mirrorTilt"];
    mirrorValues[ns_vehicleinfo.Zone.CENTER] = ["mirrorPan", "mirrorTilt"];
    this.mirror = this._buildVehicleInterface("mirror", mirrorValues);
    
    var seatAdjustmentValues = {};
    seatAdjustmentValues[ns_vehicleinfo.Zone.FRONT] = ["reclineSeatBack", "seatBackCushion", "seatCushionHeight", "seatHeadrest", "seatSideCusion", "seatSlide"];
    seatAdjustmentValues[ns_vehicleinfo.Zone.MIDDLE] = ["reclineSeatBack", "seatBackCushion", "seatCushionHeight", "seatHeadrest", "seatSideCusion", "seatSlide"];
    seatAdjustmentValues[ns_vehicleinfo.Zone.REAR] = ["reclineSeatBack", "seatBackCushion", "seatCushionHeight", "seatHeadrest", "seatSideCusion", "seatSlide"];
    seatAdjustmentValues[ns_vehicleinfo.Zone.LEFT] = ["reclineSeatBack", "seatBackCushion", "seatCushionHeight", "seatHeadrest", "seatSideCusion", "seatSlide"];
    seatAdjustmentValues[ns_vehicleinfo.Zone.RIGHT] = ["reclineSeatBack", "seatBackCushion", "seatCushionHeight", "seatHeadrest", "seatSideCusion", "seatSlide"];
    seatAdjustmentValues[ns_vehicleinfo.Zone.CENTER] = ["reclineSeatBack", "seatBackCushion", "seatCushionHeight", "seatHeadrest", "seatSideCusion", "seatSlide"];
    this.seatAdjustment = this._buildVehicleInterface("seatAdjustment", seatAdjustmentValues);
    
    var steeringWheelValues = {};
    steeringWheelValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["steeringWheelPositionTilt", "steeringWheelTelescopingPosition"];
    this.steeringWheel = this._buildVehicleInterface("steeringWheel", steeringWheelValues);
    
    var driveModeValues = {};
    driveModeValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["driveMode"];
    this.driveMode = this._buildVehicleInterface("driveMode", driveModeValues);
    
    var dashboardIlluminationValues = {};
    dashboardIlluminationValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["dashboardIllumination"];
    this.dashboardIllumination = this._buildVehicleInterface("dashboardIllumination", dashboardIlluminationValues);
    
    var vehicleSoundValues = {};
    vehicleSoundValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["activeNoiseControlMode", "engineSoundEnhancementMode"];
    this.vehicleSound = this._buildVehicleInterface("vehicleSound", vehicleSoundValues);
    
    var antilockBrakingSystemValues = {};
    antilockBrakingSystemValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["enabled", "engaged"];
    this.antilockBrakingSystem = this._buildVehicleInterface("antilockBrakingSystem", antilockBrakingSystemValues);
    
    var tractionControlSystemValues = {};
    tractionControlSystemValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["enabled", "engaged"];
    this.tractionControlSystem = this._buildVehicleInterface("tractionControlSystem", tractionControlSystemValues);
    
    var electronicStabilityControlValues = {};
    electronicStabilityControlValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["enabled", "engaged"];
    this.electronicStabilityControl = this._buildVehicleInterface("electronicStabilityControl", electronicStabilityControlValues);

    var topSpeedLimitValues = {};
    topSpeedLimitValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["speed"];
    this.topSpeedLimit = this._buildVehicleInterface("topSpeedLimit", topSpeedLimitValues);
    
    var airbagStatusValues = {};
    airbagStatusValues[ns_vehicleinfo.Zone.FRONT] = ["activated", "deployed"];
    airbagStatusValues[ns_vehicleinfo.Zone.REAR] = ["activated", "deployed"];
    airbagStatusValues[ns_vehicleinfo.Zone.MIDDLE] = ["activated", "deployed"];
    airbagStatusValues[ns_vehicleinfo.Zone.LEFT] = ["activated", "deployed"];
    airbagStatusValues[ns_vehicleinfo.Zone.RIGHT] = ["activated", "deployed"];
    this.airbagStatus = this._buildVehicleInterface("airbagStatus", airbagStatusValues);
    
    var doorValues = {};
    doorValues[ns_vehicleinfo.Zone.FRONT] = ["lock", "status"];
    doorValues[ns_vehicleinfo.Zone.REAR] = ["lock", "status"];
    doorValues[ns_vehicleinfo.Zone.MIDDLE] = ["lock", "status"];
    doorValues[ns_vehicleinfo.Zone.LEFT] = ["lock", "status"];
    doorValues[ns_vehicleinfo.Zone.RIGHT] = ["lock", "status"];  
    this.door = this._buildVehicleInterface("door", doorValues);
    
    var childSafetyLockValues = {};
    childSafetyLockValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["lock"];
    this.childSafetyLock = this._buildVehicleInterface("childSafetyLock", childSafetyLockValues);
    
    var seatValues = {};
    seatValues[ns_vehicleinfo.Zone.FRONT] = ["occupant", "seatbelt"];
    seatValues[ns_vehicleinfo.Zone.REAR] = ["occupant", "seatbelt"];
    seatValues[ns_vehicleinfo.Zone.MIDDLE] = ["occupant", "seatbelt"];
    seatValues[ns_vehicleinfo.Zone.LEFT] = ["occupant", "seatbelt"];
    seatValues[ns_vehicleinfo.Zone.RIGHT] = ["occupant", "seatbelt"];
    seatValues[ns_vehicleinfo.Zone.CENTER] = ["occupant", "seatbelt"];
    this.seat = this._buildVehicleInterface("seat", seatValues);
    
    var temperatureValues = {};
    temperatureValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["exteriorTemperature", "interiorTemperature"];
    this.temperature = this._buildVehicleInterface("temperature", temperatureValues);
    
    var rainSensorValues = {};
    rainSensorValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["rain"];
    this.rainSensor = this._buildVehicleInterface("rainSensor", rainSensorValues);
    
    var wiperStatusValues = {};
    wiperStatusValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["frontWiperSpeed", "rearWiperSpeed"];
    this.wiperStatus = this._buildVehicleInterface("wiperStatus", wiperStatusValues);
    
    var wiperSettingValues = {};
    wiperSettingValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["frontWiperControl", "rearWiperControl"];
    this.wiperSetting = this._buildVehicleInterface("wiperSetting", wiperSettingValues);
    
    var defrostValues = {};
    defrostValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["defrostRearWindow", "defrostSideMirrors", "defrostWindShield"];
    this.defrost = this._buildVehicleInterface("defrost", defrostValues);
    
    var sunroofValues = {};
    sunroofValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["openness", "tilt"];
    this.sunroof = this._buildVehicleInterface("sunroof", sunroofValues);
    
    var convertibleRoofValues = {};
    convertibleRoofValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["status"];
    this.convertibleRoof = this._buildVehicleInterface("convertibleRoof", convertibleRoofValues);
    
    var sideWindowValues = {};
    sideWindowValues[ns_vehicleinfo.Zone.FRONT] = ["lock", "openness"];
    sideWindowValues[ns_vehicleinfo.Zone.REAR] = ["lock", "openness"];
    sideWindowValues[ns_vehicleinfo.Zone.LEFT] = ["lock", "openness"];
    sideWindowValues[ns_vehicleinfo.Zone.RIGHT] = ["lock", "openness"];
    this.sideWindow = this._buildVehicleInterface("sideWindow", sideWindowValues);
    
    var climateControlValues = {};
    climateControlValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["airConditioning", "airRecirculation", "airflowDirection", "fanSpeedLevel", "heater", "seatCooler", "seatHeater", "steeringWheelHeater", "targetTemperature"];
    this.climateControl = this._buildVehicleInterface("climateControl", climateControlValues);
    
    var laneDepartureDetectionValues = {};
    laneDepartureDetectionValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["status"];
    this.laneDepartureDetection = this._buildVehicleInterface("laneDepartureDetection", laneDepartureDetectionValues);

    var alarmValues = {};
    alarmValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["status"];
    this.alarm = this._buildVehicleInterface("alarm", alarmValues);
    
    var parkingBrakeValues = {};
    parkingBrakeValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["status"];
    this.parkingBrake = this._buildVehicleInterface("parkingBrake", parkingBrakeValues);
    
    var parkingLightsValues = {};
    parkingLightsValues[ns_vehicleinfo.Zone.m_NO_ZONE] = ["setting", "status"];
    this.parkingLights = this._buildVehicleInterface("parkingLights", parkingLightsValues);
};

/** 
 * Helper method to reduce the labor of instantiating VehicleInterfaces 
 */
ns_vehicleinfo.Vehicle.prototype._buildVehicleInterface = function(name, values) {
    var zoneObj = {};

    var interface = new ns_vehicleinfo.VehicleInterface(name, null, null);
    var zones = [];
    $.each(values, function(zone, attributes) {
        if(zone !== ns_vehicleinfo.Zone.m_NO_ZONE) {
           zones.push(zone);
        }        
        zoneObj[zone] = {};
        zoneObj[zone].values = [];
        zoneObj[zone].timestamp = 0;

        if(Object.prototype.toString.call( attributes ) === '[object Object]') {
            $.each(attributes, function(attribute, defaultValue) {
                zoneObj[zone].values.push(attribute);                    
                var storedVal = interface._getValue(attribute, zone);
                if(storedVal === "" || storedVal === "null") {
                    interface._setValue(attribute, defaultValue);
                }
                interface[attribute] = defaultValue;           
            });
        } else {
            zoneObj[zone].values = attributes;
            $.each(attributes, function(i, attribute) {
                interface[attribute] = null;
            });            
        }
    });
    interface.m_valueNames = zoneObj;
    interface.zones = new ns_vehicleinfo.Zone(zones);
   

    return interface;
};

ns_vehicleinfo._startTimer = function () {
    ns_vehicleinfo.m_timer = setInterval ( function () {
        var LStime = localStorage.getItem ("abaltatech_vehdata_timestamp");

        $.each ( window.navigator.vehicle, function(i, vehicleInterface) {
            // Detect whether the current property is an interface
            if(vehicleInterface instanceof ns_vehicleinfo.VehicleInterface) {
                var availability = vehicleInterface._getAvailable();   
                if(availability.availability === ns_vehicleinfo.Availability.AVAILABLE) {       
                    $.each(vehicleInterface.m_valueNames, function(zone, info) {
                        if(info.timestamp < LStime) {
                            var vehicleObject = vehicleInterface._getVehicleObject(zone);
                            if(vehicleObject.changed) {
                                ns_vehicleinfo.notificationList
                                    .notifyAll(vehicleInterface.m_attrName + "_" + zone, [vehicleObject.vehicleObject]);                        
                            }                      
                       }
                    });
                }
                if(availability.changed) {
                    ns_vehicleinfo.notificationList.notifyAll(
                            vehicleInterface.m_attrName + "Available", [availability.availability]);                        
                }                
//                if(vehicleInterface.m_lastTimeStamp < LStime) {
//                    console.debug("Changed detected. Notifying any subscribers.");
//                    var availability = vehicleInterface._getAvailable();
//                    if(availability === ns_vehicleinfo.Availability.AVAILABLE) {
//                        var vehicleObject = vehicleInterface._getVehicleObject();
//                        console.debug("Availability");
//                        console.debug(availability);
//                        if(vehicleObject.changed) {
//                            console.debug("vehicle object changed");
//                            ns_vehicleinfo.notificationList
//                                .notifyAll(vehicleInterface.m_attrName, [vehicleObject.vehicleObject]);                        
//                        }
//                    }
//                }
            }
        });
    }, 1000);
};

ns_vehicleinfo._stopTimer = function () {
    ns_vehicleinfo.m_timer = clearInterval ( ns_vehicleinfo.m_timer );
};

