/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Models.PlatformModel = M.Model.extend({
    	
    	defaults : {
    		platformID : '',
    		oemName : '',
    		hardwareVersion : '',
    		softwareVersion : '',
    		embedded : ''
    	},
        // The Model Identifier
        idAttribute: '_id',
        //The Model options
        
        initialize: function () {
        	console.debug('PlatformModel#initialize');
        }
    });

})();
