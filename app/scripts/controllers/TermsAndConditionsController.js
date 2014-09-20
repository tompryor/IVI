/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Controllers = LibertyMutualIVIBaseApp.Controllers || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Controllers.TermsAndConditionsController = M.Controller.extend({
    	
    	_indexView : null,

        // Called from the router when the application starts
        applicationStart: function () {
        	this._initLayout();
        	this.checkTermsAndConditions();
            this.checkTrackingSetAutomatically();
        },

        // Called from the router everytime the route/url matches the controller (binding in main.js)
        show: function () {
        	this._initLayout();
        	this.checkTermsAndConditions();
            this.checkTrackingSetAutomatically();
        },

        // Called for every controller when the application is ready. applicationStart is always called before.
        applicationReady: function () {
        	
        },

          
        _initLayout : function () {          
            var layout = LibertyMutualIVIBaseApp.Layouts.TermsAndConditionsLayout.create(this);
            LibertyMutualIVIBaseApp.setLayout(layout);
            this.initViews();
            this._applyViews();
            
        },
        
        
        initViews: function(){
        	this._indexView = LibertyMutualIVIBaseApp.Views.TermsAndConditionsView.create();
          },

        _applyViews : function () {
        	LibertyMutualIVIBaseApp.getLayout().applyViews({
                content: this._indexView
            });
        },
        
        setTermsAndConditions: function(terms){
        	LibertyMutualIVIBaseApp.Models.UserModel.set({'acceptedTermsAndConditions':terms});
        },
        
        checkTermsAndConditions: function(){
        	if(LibertyMutualIVIBaseApp.Models.UserModel.get('acceptedTermsAndConditions')){
            	LibertyMutualIVIBaseApp.navigate({
                    route: 'welcome'
                });
        	}
        },
        
        checkTrackingSetAutomatically: function(){
        	if(LibertyMutualIVIBaseApp.Models.UserModel.get('trackingSetAutomatically')){
            	LibertyMutualIVIBaseApp.navigate({
                    route: 'triptracking'
                });
        	}
        }
    });
})();
