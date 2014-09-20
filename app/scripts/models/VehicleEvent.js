/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Models.VehicleEventModel = M.Model.extend({
        // The Model Identifier
        idAttribute: '_id',
        //The Model options
        	
    	defaults: {
    		timestamp: 0,
    	}
    });

})();
