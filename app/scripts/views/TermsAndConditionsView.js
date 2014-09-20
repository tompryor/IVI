/*global LibertyMutualIVIBaseApp, Backbone, JST*/

LibertyMutualIVIBaseApp.Views = LibertyMutualIVIBaseApp.Views || {};

var scrolled = 0;

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Views.TermsAndConditionsView = M.View.extend({

    	template: LibertyMutualIVIBaseApp.Templates.TermsAndConditions,

        cssClass: '',
        value: '',
 


	    initialize: function() { 
		    this.render();
			//this.listenTo(this.model, "change", this.render);
    	},
    	
    	render: function() {
     		this.$el.html(this.template());
    		
    		return this;
    	},
    	
    	events: {
    		"click #accept_button":"acceptButton",
    		"click #decline_button":"declineButton",
    		"click #upButton_termsandconditions":"scrollUp",
    		"click #downButton_termsandconditions":"scrollDown",
    			
    	},
    	
    	acceptButton: function() {
    		LibertyMutualIVIBaseApp.navigate({route: '#welcome', trigger: true});
    		LibertyMutualIVIBaseApp.Models.UserModel.set({'acceptedTermsAndConditions':true});
    	},
    	
    	declineButton: function() {
    		console.log("closing app");
    		window.close();
    		
    	},
    	
    	scrollUp: function() {
    		
    		if (scrolled > 0) {
   			 scrolled = scrolled - 100;
   			 if (scrolled > 0 ) {
   				//$('#upButton_termsandconditions').removeClass("scroll_button_disabled");
   			 } else if (scrolled <= 0){
   				$('#upButton_termsandconditions').addClass("scroll_button_disabled");
   			 };
   			 if (scrolled <= 200){
   				$('#downButton_termsandconditions').removeClass("scroll_button_disabled");
   			 };
   		

			$(".termsConditionsContent").animate({
			        scrollTop:  scrolled
			   });
			console.log("scrolling up");
   		};
    		
    	},
    	
    	scrollDown: function() {
    		
    		if (scrolled < 2200) {
    			scrolled = scrolled + 100;
    		};
   			
   			if(scrolled < 2200) {
   				//$('#downButton_termsandconditions').removeClass("scroll_button_disabled");
      		} else if (scrolled >= 2200){
      			$('#downButton_termsandconditions').addClass("scroll_button_disabled");
       		};
       		if (scrolled >= 0){
       			$('#upButton_termsandconditions').removeClass("scroll_button_disabled");
       		};
   			

		$(".termsConditionsContent").animate({
		        scrollTop:  scrolled
		   });
		console.log("scrolling down");

    	}
    	
    	
    });
})();
