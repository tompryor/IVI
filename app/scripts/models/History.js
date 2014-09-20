/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Models.HistoryModel = M.Model.extend({
        // The Model Identifier
        idAttribute: '_id',
        //The Model options
        defaults: {
        hasTrips: false,
        tripDate: 'October 2, 2014',
        tripTime: '6:45pm',
        accelEventsLow: 1,
        accelEventsMed: 2,
        accelEventsHigh: 3,
        accelFactor: '',
        brakeEventsLow: 4,
        brakeEventsMed: 5,
        brakeEventsHigh: 6,
        brakeFactor: '',
        tripMileage: 25,
        tripNightMileage: 2
        
        },
        
        accelEventsTotal: function() {
        	return this.accelEventsLow + this.accelEventsMed + this.accelEventsHigh;	
        },
    
    	brakeEventsTotal: function() {
    		return this.brakeEventsLow + this.brakeEventsMed + this.brakeEventsHigh;
    	},
    	
    	nightMileagePercent: function() {
    		return this.tripNightMileage/this.tripMileage;
    	}
        
    });

})();
