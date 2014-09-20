/*global LibertyMutualIVIBaseApp, Backbone, JST*/

LibertyMutualIVIBaseApp.Views = LibertyMutualIVIBaseApp.Views || {};

var scrolled = 0;

window.initialHeight = 0;


(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Views.ReportDetailView = M.View.extend({
    	
    	grid: 'col-xs-12',

    	template: LibertyMutualIVIBaseApp.Templates.ReportDetail,

	    initialize: function() {
		    this.render();
			this.listenTo(this.model, "change", this.render);
    	},

    	render: function() {
            this.$el.html(this.template(this.model.toJSON()));
    		return this;
    	},
   
    	
    	events: {
    		"click #upButton_trip_report":"scrollUp",
    		"click #downButton_trip_report":"scrollDown",
    		"click #back_button_report_detail":"goBack",
    		"click #button_email_report":"emailReport"
    	},
    	
    	setHeight: function() {
    		window.initialHeight = $('#scrollable_trip_report').height();
    		
    	},
    	
    	scrollUp: function() {        	
        		
    		scrolled -= 100;
    		
        	$('#scrollable_trip_report').animate({
    	        scrollTop:  scrolled
    	   }, function() {
    		   
    		   var visibleHeight = document.getElementById('scrollable_trip_report').clientHeight;
    		   var scrollableHeight = $('#scrollable_trip_report')[0].scrollHeight;
    		   var scrollTopHeight = $('#scrollable_trip_report').scrollTop();
          
    		   var isScrolled = (scrollableHeight - scrollTopHeight) == visibleHeight;
    		   
    		   if(scrolled <= 0){
      				$('#upButton_trip_report').addClass("scroll_button_disabled");
       				$('#upButton_trip_report').attr("disabled", "disabled");
    		   }
    		   if(!isScrolled) {
        			$('#downButton_trip_report').removeClass("scroll_button_disabled");
         			$('#downButton_trip_report').removeAttr("disabled");
       		}
    		   
    	   }
        	);
        	
        	console.log(this.initialHeight);
    		
    		
    		
    		
    		
    		
    	},
    	
    	scrollDown: function() {
    		
    	
    	scrolled += 100;
    		
    	$('#scrollable_trip_report').animate({
	        scrollTop:  scrolled
	        
    	}, function(){
        	
        	var visibleHeight = document.getElementById('scrollable_trip_report').clientHeight;
        	var scrollableHeight = $('#scrollable_trip_report')[0].scrollHeight;
        	var scrollTopHeight = $('#scrollable_trip_report').scrollTop();
       
        	var isScrolled = (scrollableHeight - scrollTopHeight) == visibleHeight;
        	
        	if (scrolled < initialHeight) {
    			scrolled = scrolled + 100;
    		};
   			
    		if(isScrolled) {
     			$('#downButton_trip_report').addClass("scroll_button_disabled");
      			$('#downButton_trip_report').attr("disabled", "disabled");
    		}
    		if(scrolled >= 0){
       			$('#upButton_trip_report').removeClass("scroll_button_disabled");
       			$('#upButton_trip_report').removeAttr("disabled");
    		}
    		
    	}
    	);
    	 
    	
    	

    	},
    	
    	goBack: function() {
    		
    		LibertyMutualIVIBaseApp.navigate({route : '#reports', trigger : true});
    		
    	},
    	
    	emailReport: function() {
    		
    		if(LibertyMutualIVIBaseApp.Models.UserModel.get('isRegistered')) {
    			LibertyMutualIVIBaseApp.navigate({route : '#Sending_Email', trigger : true});
    		} else {
    			LibertyMutualIVIBaseApp.navigate({route : '#registration', trigger : true});	
    		}
    		
    	}
    	
    });
})();
