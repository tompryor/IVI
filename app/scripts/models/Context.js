/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Models.ContextModel = M.Model.extend({
        // The Model Identifier
        idAttribute: '_id',
        //The Model options
        	
        defaults: {
        	platform: 'WebLink',
        },
    
    	initialize: function() {
    		// do stuff to set platform to WebLink or w/e
    		
    		console.debug('ContextModel#initialize');
    		
    	}
    });
})();
