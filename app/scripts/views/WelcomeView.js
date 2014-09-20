/*global LibertyMutualIVIBaseApp, Backbone, JST*/

LibertyMutualIVIBaseApp.Views = LibertyMutualIVIBaseApp.Views || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Views.WelcomeView = M.View.extend({

    	template: LibertyMutualIVIBaseApp.Templates.Welcome,

        cssClass: '',
        value: '',


	    initialize: function() { 
		    this.render();
			this.listenTo(this.model, "change", this.render);
    	},
    	
    	render: function() {
     		this.$el.html(this.template()); 

    		if (LibertyMutualIVIBaseApp.Models.UserModel.get('isRegistered')) {
    			
    			$('#value_prop_header').html('Hi, '+ LibertyMutualIVIBaseApp.Models.UserModel.get('firstName') + '.');
    			$('#value_prop_text').html('Thank you for registering.');
    			$('#register_button').remove();
    			$('#left_column_main').append('<div class = "score_status_text">' + 
				 			'Overall Score' +
				 		'</div>' +
				 		'<div class = "score_status_icon">' +
				 			 '<div id="score_main_page">' +
				 				LibertyMutualIVIBaseApp.Models.ScoreModel.get('score') +
				 			'</div>' + 
				 		'</div>' +
				 		'<div class = "score_status_text">' +
				 			'Status' +
				 		'</div>' + 
				 		'<div class = "score_status_icon">' + 
				 			'<i class="fa fa-trophy"></i>' + 
				 		'</div>');
    			$('#main_bottom_row_hidden').html('<div class = "score_status_text score_status_text_hidden">' + 
				 			'Overall Score' +
				 		'</div>' +
				 		'<div class = "score_status_icon score_status_icon_hidden">' +
				 			 '<div id="score_main_page">' +
				 				LibertyMutualIVIBaseApp.Models.ScoreModel.get('score') +
				 			'</div>' + 
				 		'</div>' +
				 		'<div class = "score_status_text score_status_text_hidden">' +
				 			'Status' +
				 		'</div>' + 
				 		'<div class = "score_status_icon score_status_icon_hidden">' + 
				 			'<i class="fa fa-trophy"></i>' + 
				 		'</div>');
    			
    			
    			/*

    			
    			$('#left_column_main').append('<table id="score_status_table"><tr class="score_status_row"><td class="score_status_text"><span data-contentKey="dss_overallscoretext"> Overall Score</span></td><td class="icon_main_page"><div class="score_status_icon"><span id="score_main_page">' + LibertyMutualIVIBaseApp.Models.ScoreModel.get('score') + '</span></div></td>' +
    '</tr><tr id="row_spacer"><td></td><td></td></tr><tr><td class="score_status_text"><span data-contentKey="dss_statustext" > Status </span></td><td class="icon_main_page"><div class="score_status_icon"><span id="medallion_main_page" data-contentKey="user_status_medallion" <i class="fa fa-trophy"></i></span></div></td></tr></table>');
    			//$('#left_column_main').append('<div id="score_container_main_page"><div class="score_status_text"><span data-contentKey="dss_overallscoretext"> Overall <br />  Score</span><div class="score_status_icon"><span id="score_main_page">' + LibertyMutualIVIBaseApp.Models.ScoreModel.get('score') + '</span></div></div>');
    			//$('#left_column_main').append('<div id="status_container_main_page"><div class="score_status_text"><span data-contentKey="dss_statustext" > Status </span></div><div class="score_status_icon"><span id="medallion_main_page" data-contentKey="user_status_medallion" <i class="fa fa-trophy"></i></span></div></div>');
    			*/
    		}
    		return this;
    	},
    	
    	events: {
    		"click #register_button":"registration",
    		"click #start_drive_button":"startdrivecoach",
    		"click #view_reports_button":"viewreports",
    		"click #accident_checklist_button":"accidentchecklist"
    		
    	},
    	
    	registration: function(){
    		LibertyMutualIVIBaseApp.navigate({route : '#registration', trigger : true});
    	},
    	
    	startdrivecoach: function(){
    		LibertyMutualIVIBaseApp.navigate({route : '#triptracking', trigger : true});
    		LibertyMutualIVIBaseApp.CoreEngine.GlobalTripManager.newTrip();
    	},
    	
    	viewreports: function(){
    		//if (LibertyMutualIVIBaseApp.Models.HistoryModel.get('hasTrips')) {
    			LibertyMutualIVIBaseApp.navigate({route : '#reports', trigger : true});
    		//}
    		//else
    		//	$('#view_reports_button').addClass('disabled');
    			
    	},
    	
    	accidentchecklist: function(){
    		LibertyMutualIVIBaseApp.navigate({route : '#accidentchecklist', trigger : true});
    	},
    });
})();
