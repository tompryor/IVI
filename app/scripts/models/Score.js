/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Models.ScoreModel = M.Model.extend({
        // The Model Identifier
        idAttribute: '_id',
        //The Model options
        	
        	
    	defaults: {
    		score: '0'
    	}
    });

})();
