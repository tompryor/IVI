/*global LibertyMutualIVIBaseApp, _, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function () {
    'use strict';


    LibertyMutualIVIBaseApp.Models.BridgeModel = M.Model.extend(/** @lends BridgeModel.prototype */{
        /** @class BridgeModel
         * @author IVI TDP Team
         * @augments Backbone.Model
         * @requires jQuery
         * @requires Backbone.js
         * @requires Underscore.js
         * @contructs LibertyMutualIVIBaseApp.Models.BridgeModel object
         *
         * @param {map} default Default model attributes to pass in.
         * @param {map} options Extra options to pass into the model.
         *
         */
        initialize: function(){
            console.debug('BridgeModel#initialize');
            if(LibertyMutualIVIBaseApp.Models.ContextModel.get('platform') === 'WebLink'){
                LibertyMutualIVIBaseApp.Models.WebLinkPluginModel = new LibertyMutualIVIBaseApp.Models.WebLinkPluginModel();
                this.plugin = LibertyMutualIVIBaseApp.Models.WebLinkPluginModel;
            } else {
                throw 'Unknown platform';
            }
        },

        /**
         * The Model Identifier
         * @memberOf! BridgeModel
         * @type {String}
         */
        idAttribute: '_id',
        /**
         * The Defaults Object
         * @memberOf! BridgeModel
         * @type {Object}
         */
        defaults: {
    		plugin: ''
    	},	

        /** Accessor Overrides.
         * @param {String} attr the property value to return */
        get: function(attr) {
            var value = Backbone.Model.prototype.get.call(this, attr);
            return _.isFunction(value) ? value.call(this) : value;
        },
        
        /** JSON Serializer.
         * @return {Object} data as a JSON Object */
        toJSON: function() {
		  var data = {};
		  var json = Backbone.Model.prototype.toJSON.call(this);
		  _.each(json, function(value, key) {
		    data[key] = this.get(key);
		  }, this);
		  return data;
		},
	
		

// geoLocaiton ----------------------------------------------------------------------
        /** Get GPS Time Stamp.
         * @return {Object} data as a JSON Object */
    	gpsTimestamp: function() {
    		return this.plugin.get('gpsTimestamp');
    	},
    	gpsAccuracy: function() {
    		return  this.plugin.get('gpsAccuracy');
    	},
    	gpsAltitude: function() {
    		return  this.plugin.get('gpsAltitude');
    	},
    	gpsAltitudeAccuracy: function() {
    		return  this.plugin.get('gpsAltitudeAccuracy');
    	},
    	gpsHeading: function (){
    		return  this.plugin.get('gpsHeading');
    	},
    	gpsLatitude: function() {
    		return  this.plugin.get('gpsLatitude');
    	},
    	gpsLongitude: function() {
    		return  this.plugin.get('gpsLongitude');
    	},
    	gpsSpeed: function() {
    		return  this.plugin.get('gpsSpeed');
    	},

//Vehicle Running Status Attributes ----------------------------------------------
    	acceleration: function() {
			return this.plugin.get('acceleration');
    	},
    	speed: function() {
			return this.plugin.get('speed');
    	},
    	tripMeter: function() {
			return this.plugin.get('tripMeter');
    	},
        	
// Vehicle Identification Attributes-------------------------------------------
        // returns the vehicle identification number
    	vin: function() {
    		return this.plugin.get('vin');
    	}, 
    	// returns the world manufacturer identifier
    	wmi: function() {
    		return this.plugin.get('wmi');
    	}, 
    	//returns the vehicle brand name
    	brand: function() {
    		return this.plugin.get('brand');
    	}, 
    	//returns the vehicle model type
    	model: function() {
    		return this.plugin.get('model');
    	}, 
    	//returns the type of the vehicle
    	vehicleType: function() {
    		return this.plugin.get('vehicleType');
    	},
    	//returns the vehicle model year
    	year: function() {
    		return this.plugin.get('year');
    	}
    });
})();
