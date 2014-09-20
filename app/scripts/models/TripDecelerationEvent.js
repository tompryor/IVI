/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Models.TripDecelerationEventModel = LibertyMutualIVIBaseApp.Models.TripEventModel.extend({
        // The Model Identifier
        idAttribute: '_id',
        //The Model options
        defaults: {
            decelAboveThresh: '',
            decelBelowThresh: ''
            },
            	
    });

})();
