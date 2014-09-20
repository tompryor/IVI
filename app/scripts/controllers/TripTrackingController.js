/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Controllers = LibertyMutualIVIBaseApp.Controllers || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Controllers.TriptrackingController = M.Controller.extend({

        // Called from the router when the application starts
        applicationStart: function () {
        	this._initLayout();
        	console.log('TriptrackingController.applicationStart()');
        },

        // Called from the router everytime the route/url matchs the controller (binding in main.js)
        show: function () {
        	this._initLayout();
            console.log('TriptrackingController.show()');
        },

        // Called for every controller when the application is ready. applicationStart is always called before.
        applicationReady: function () {
            console.log('TriptrackingController.applicationReady()');
        },
        
        _initLayout : function () {
            var layout = LibertyMutualIVIBaseApp.Layouts.TriptrackingLayout.create(this);
            LibertyMutualIVIBaseApp.setLayout(layout);
            this.initViews();
            
            
        },
        initViews: function(){
        	
        	
          },

    });

})();
