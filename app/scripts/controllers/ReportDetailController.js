/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Controllers = LibertyMutualIVIBaseApp.Controllers || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Controllers.ReportDetailController = M.Controller.extend({
    	
    	_indexView : null,

        // Called from the router when the application starts
        applicationStart: function () {
        	this._initLayout();
        },

        // Called from the router everytime the route/url matches the controller (binding in main.js)
        show: function () {
        	this._initLayout();
            
        },

        // Called for every controller when the application is ready. applicationStart is always called before.
        applicationReady: function () {
        	
        },

          
        _initLayout : function () {
            var layout = LibertyMutualIVIBaseApp.Layouts.ReportDetailLayout.create(this);
            LibertyMutualIVIBaseApp.setLayout(layout);
            this.initViews();
            this._applyViews();
            
        },
        
        
        initViews: function(){
        	this._headerView = LibertyMutualIVIBaseApp.Views.HeaderView.create({model: LibertyMutualIVIBaseApp.Models.UserModel});
        	LibertyMutualIVIBaseApp.Models.HistoryModel = new LibertyMutualIVIBaseApp.Models.HistoryModel();
        	this._contentView = LibertyMutualIVIBaseApp.Views.ReportDetailView.create({model: LibertyMutualIVIBaseApp.Models.HistoryModel});
        	//this._historyView = LibertyMutualIVIBaseApp.Views.HistoryView.create({model: LibertyMutualIVIBaseApp.Models.HistoryModel});
          },

        _applyViews : function () {
        	LibertyMutualIVIBaseApp.getLayout().applyViews({
        		header: this._headerView,
                content: this._contentView
            });
        	
        	if($(window).width() <= 630){
        		$('#header_text_trip_report').removeClass('col-xs-7');
        		$('#header_text_trip_report').addClass('col-xs-6');
        		
        		$('#button_container_email_trip_report').removeClass('col-xs-3');
        		$('#button_container_email_trip_report').addClass('col-xs-4');
        		
        	}
        	
        	if($(window).width() <= 670){
        		$('#map_trip_report').remove();
        		$('#metrics_block_trip_report').removeClass('col-xs-6');
        		$('#metrics_block_trip_report').addClass('col-xs-10');
        	}
        }
          
          
        
    });
})();
