/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Models.VehicleGpsEventModel = LibertyMutualIVIBaseApp.Models.VehicleEventModel.extend({
        // The Model Identifier
        idAttribute: '_id',
        //The Model options
        	
    	defaults: {
    		latitude: 0,
    		longitude: 0
    	}
    });

})();
