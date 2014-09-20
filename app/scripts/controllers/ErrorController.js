/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Controllers = LibertyMutualIVIBaseApp.Controllers || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Controllers.ErrorController = M.Controller.extend({
    	
    	_indexView : null,

        // Called from the router when the application starts
        applicationStart: function () {
        	this._initLayout();
        },

        // Called from the router everytime the route/url matches the controller (binding in main.js)
        show: function () {
        	this._initLayout();
            //LibertyMutualIVIBaseApp.getLayout().startTransition();
            
        },

        // Called for every controller when the application is ready. applicationStart is always called before.
        applicationReady: function () {
        	
        },

          
        _initLayout : function () {
            var layout = LibertyMutualIVIBaseApp.Layouts.ErrorLayout.create(this);
            LibertyMutualIVIBaseApp.setLayout(layout);
            this.initViews();
            this._applyViews();
            
        },
        
        
        initViews: function(){
        	this._headerView = LibertyMutualIVIBaseApp.Views.HeaderView.create({model: LibertyMutualIVIBaseApp.Models.UserModel});
        	this._contentView = LibertyMutualIVIBaseApp.Views.ErrorView.create({model: LibertyMutualIVIBaseApp.Models.UserModel});
        	//this._historyView = LibertyMutualIVIBaseApp.Views.HistoryView.create({model: LibertyMutualIVIBaseApp.Models.HistoryModel});
          },

        _applyViews : function () {
        	LibertyMutualIVIBaseApp.getLayout().applyViews({
        		header: this._headerView,
                content: this._contentView
            });
        }
        
    });
})();
